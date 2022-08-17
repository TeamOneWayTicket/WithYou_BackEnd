import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from './diary.entity';
import { Repository } from 'typeorm';
import { UpdateDiaryDto } from './diaryDto/update-diary.dto';
import { CreateDiaryDto } from './diaryDto/create-diary.dto';
import { ApiConfigService } from '../shared/services/api-config.service';
import { DiaryMedium } from './diary.medium.entity';
import { CreateMediaDto } from './diaryDto/create-media.dto';
import { CreateMediumResponseDto } from './diaryDto/create-medium-response.dto';
import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { PutPresignedUrlsDto } from './diaryDto/put-presigned-urls.dto';
import { PutPresignedUrlResponseDto } from './diaryDto/put-presigned-url-response.dto';
import { PutSignedUrlsResponse } from './diaryDto/putSignedUrlsResponse';
import { GetPresignedUrlsResponseDto } from './diaryDto/get-presigned-urls-response.dto';
import { DiaryResponseDto } from './diaryDto/diary-response.dto';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    @InjectRepository(DiaryMedium)
    private readonly diaryMediumRepository: Repository<DiaryMedium>,
    private readonly configService: ApiConfigService,
  ) {
    AWS.config.update({
      region: this.configService.awsConfig.bucketRegion,
      accessKeyId: this.configService.awsConfig.accessKey,
      secretAccessKey: this.configService.awsConfig.secretAccessKey,
    });
  }

  async findAllByAuthorId(authorId: number): Promise<Diary[]> {
    return await this.diaryRepository.find({ where: { authorId } });
  }

  async findAllByFamilyId(familyId: number): Promise<Diary[]> {
    return await this.diaryRepository.find({ where: { familyId } });
  }

  async findOne(id: number): Promise<Diary> {
    return await this.diaryRepository.findOne({ where: { id } });
  }

  async findOneWithUrls(id: number): Promise<DiaryResponseDto> {
    const diary = await this.diaryRepository.findOne({ where: { id } });
    const urls = await this.getDiaryMediumsSignedUrl(id);

    return {
      diary,
      getMediumUrls: urls.s3Urls,
    };
  }

  async createDiary(userId: number, diary: CreateDiaryDto): Promise<Diary> {
    // userId로 familyId 찾아 넣고 일기 생성 (family table 만들고 수정 필요)
    return await this.diaryRepository.save(diary);
  }

  async updateDiary(targetId: number, diary: UpdateDiaryDto): Promise<Diary> {
    const targetDiary: Diary = await this.findOne(targetId);
    const { id, familyId, authorId, createdAt, author, medium } = targetDiary;
    const { content } = diary;
    const updatedDiary: Diary = {
      id,
      familyId,
      authorId,
      createdAt,
      author,
      content,
      medium,
    };
    await this.diaryRepository.update(targetId, updatedDiary);
    return await this.findOne(targetId);
  }

  async createDiaryMedia(diaryMedia: CreateMediaDto): Promise<DiaryMedium> {
    return await this.diaryMediumRepository.save(diaryMedia);
  }

  async createDiaryMedium(
    diaryId: number,
    fileNamesInS3: string[],
  ): Promise<CreateMediumResponseDto> {
    const diary = await this.findOne(diaryId);
    const diaryMedium: DiaryMedium[] = [];
    for (let i = 0; i < fileNamesInS3.length; i++) {
      const medium: CreateMediaDto = {
        fileNameInS3: fileNamesInS3[i],
        diary,
        diaryId,
        order: i,
      };
      diaryMedium.push(await this.createDiaryMedia(medium));
    }
    return { diaryMedium } as CreateMediumResponseDto;
  }

  async getDiaryMediumsSignedUrl(
    diaryId: number,
  ): Promise<GetPresignedUrlsResponseDto> {
    const s3 = new AWS.S3({ useAccelerateEndpoint: true });

    const mediums = await this.diaryMediumRepository.findBy({
      diaryId: diaryId,
    });

    const s3Urls: string[] = [];
    for (const media of mediums) {
      const s3Url = await s3.getSignedUrlPromise('getObject', {
        Bucket: this.configService.awsConfig.bucketName,
        Key: media.fileNameInS3,
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
