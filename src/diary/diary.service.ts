import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from './diary.entity';
import { Repository } from 'typeorm';
import { UpdateDiaryDto } from './diaryDto/update-diary.dto';
import { ApiConfigService } from '../shared/services/api-config.service';
import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { PutPresignedUrlsDto } from './diaryDto/put-presigned-urls.dto';
import { PutPresignedUrlResponseDto } from './diaryDto/put-presigned-url-response.dto';
import { PutSignedUrlsResponse } from './diaryDto/putSignedUrlsResponse';
import { GetPresignedUrlsResponseDto } from './diaryDto/get-presigned-urls-response.dto';
import { DiaryResponseDto } from './diaryDto/diary-response.dto';
import { UserService } from '../user/user.service';
import { CreateDiaryDto } from './diaryDto/create-diary.dto';
import { DiaryMedium } from './diary.medium.entity';
import { CreateMediumDto } from './diaryDto/create-medium.dto';
import { CreateMediaResponseDto } from './diaryDto/create-media-response.dto';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    @InjectRepository(DiaryMedium)
    private readonly diaryMediumRepository: Repository<DiaryMedium>,
    private readonly configService: ApiConfigService,
    private readonly userService: UserService,
  ) {
    AWS.config.update({
      region: this.configService.awsConfig.bucketRegion,
      accessKeyId: this.configService.awsConfig.accessKey,
      secretAccessKey: this.configService.awsConfig.secretAccessKey,
    });
  }

  async findAllByAuthorId(authorId: number): Promise<DiaryResponseDto[]> {
    const diaries = await this.diaryRepository.find({ where: { authorId } });
    const diariesWithUrl: DiaryResponseDto[] = [];
    for (const diary of diaries) {
      const diaryWithUrl: DiaryResponseDto = {
        diary: diary,
        mediaUrls: (await this.getDiaryMediaUrls(diary.id)).s3Urls,
      };
      diariesWithUrl.push(diaryWithUrl);
    }
    return diariesWithUrl;
  }

  async findAllByFamilyId(familyId: number): Promise<DiaryResponseDto[]> {
    const diaries = await this.diaryRepository.find({ where: { familyId } });
    const diariesWithUrl: DiaryResponseDto[] = [];
    for (const diary of diaries) {
      const diaryWithUrl: DiaryResponseDto = {
        diary: diary,
        mediaUrls: (await this.getDiaryMediaUrls(diary.id)).s3Urls,
      };
      diariesWithUrl.push(diaryWithUrl);
    }
    return diariesWithUrl;
  }

  async findOne(id: number): Promise<Diary> {
    return await this.diaryRepository.findOne({ where: { id } });
  }

  async findDiaryWithUrls(id: number): Promise<DiaryResponseDto> {
    const diary = await this.diaryRepository.findOne({ where: { id } });

    return {
      diary,
      mediaUrls: (await this.getDiaryMediaUrls(id)).s3Urls,
    };
  }


  async createDiary(authorId: number, content: string): Promise<Diary> {
    const familyId = (await this.userService.findOne(authorId)).familyId;
    const diary: CreateDiaryDto = {
      authorId,
      content,
      familyId,
    };
    return await this.diaryRepository.save(diary);
  }

  async updateDiary(targetId: number, diary: UpdateDiaryDto): Promise<Diary> {
    const targetDiary: Diary = await this.findOne(targetId);
    const { id, familyId, authorId, createdAt, author, media } = targetDiary;
    const { content } = diary;
    const updatedDiary: Diary = {
      id,
      familyId,
      authorId,
      createdAt,
      author,
      content,
      media,
    };
    await this.diaryRepository.update(targetId, updatedDiary);
    return await this.findOne(targetId);
  }

  async createDiaryMedium(diaryMedium: CreateMediumDto): Promise<DiaryMedium> {
    return await this.diaryMediumRepository.save(diaryMedium);
  }

  async createDiaryMedia(
    diaryId: number,
    fileNamesInS3: string[],
  ): Promise<CreateMediaResponseDto> {
    const diary = await this.findOne(diaryId);
    const diaryMedia: DiaryMedium[] = [];
    for (let i = 0; i < fileNamesInS3.length; i++) {
      const medium: CreateMediumDto = {
        fileNameInS3: fileNamesInS3[i],
        diary,
        diaryId,
        order: i,
      };
      diaryMedia.push(await this.createDiaryMedium(medium));
    }
    return { diaryMedia } as CreateMediaResponseDto;
  }

  async getDiaryMediaUrls(
    diaryId: number,
  ): Promise<GetPresignedUrlsResponseDto> {
    const s3 = new AWS.S3({ useAccelerateEndpoint: true });

    const media = await this.diaryMediumRepository.findBy({
      diaryId: diaryId,
    });

    const s3Urls: string[] = [];
    for (const medium of media) {
      const s3Url = await s3.getSignedUrlPromise('getObject', {
        Bucket: this.configService.awsConfig.bucketName,
        Key: medium.fileNameInS3,
        Expires: 3600,
      });

      s3Urls.push(s3Url);
    }
    return { s3Urls } as GetPresignedUrlsResponseDto;
  }

  async getSignedUrlsForGetObject(
    fileNamesInS3: string[],
  ): Promise<GetPresignedUrlsResponseDto> {
    const s3 = new AWS.S3({ useAccelerateEndpoint: true });
    const s3Urls: string[] = [];
    for (let i = 0; i < fileNamesInS3.length; i++) {
      const s3Url = await s3.getSignedUrlPromise('getObject', {
        Bucket: this.configService.awsConfig.bucketName,
        Key: fileNamesInS3[i],
        Expires: 3600,
      });
      s3Urls.push(s3Url);
    }

    return { s3Urls } as GetPresignedUrlsResponseDto;
  }

  async getSignedUrlsForPutObject(
    query: PutPresignedUrlsDto,
  ): Promise<PutSignedUrlsResponse> {
    const fileType: string = query.contentType.split('/')[1];
    const s3 = new AWS.S3({ useAccelerateEndpoint: true });
    const signedUrls: PutPresignedUrlResponseDto[] = [];

    for (let i = 0; i < query.quantity; i++) {
      const fileName = `diary/${query.diaryId}/${uuid()}.${fileType}`;
      const s3Url = await s3.getSignedUrlPromise('putObject', {
        Bucket: this.configService.awsConfig.bucketName,
        Key: fileName,
        Expires: 3600,
      });

      const info = {
        fileName,
        s3Url,
      } as PutPresignedUrlResponseDto;

      signedUrls.push(info);
    }

    return { signedUrls } as PutSignedUrlsResponse;
  }
}
