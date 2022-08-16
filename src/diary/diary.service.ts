import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from './diary.entity';
import { Repository } from 'typeorm';
import { UpdateDiaryDto } from './diaryDto/updateDiaryDto';
import { CreateDiaryDto } from './diaryDto/createDiaryDto';
import { ApiConfigService } from '../shared/services/api-config.service';
import { DiaryMedium } from './diary.medium.entity';
import { CreateMediumDto } from './diaryDto/createMediumDto';
import { CreateMediumsResponse } from './diaryDto/createMediumsResponse';
import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { PutSignedUrlsDto } from './diaryDto/putSignedUrlsDto';
import { PutSignedUrlResponse } from './diaryDto/putSignedUrlResponse';
import { PutSignedUrlsResponse } from './diaryDto/putSignedUrlsResponse';
import { GetSignedUrlsResponse } from './diaryDto/getSignedUrlsResponse';

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
    return this.diaryRepository.find({ where: { authorId } });
  }

  async findOne(id: number): Promise<Diary> {
    return this.diaryRepository.findOne({ where: { id } });
  }

  async createDiary(userId: number, diary: CreateDiaryDto): Promise<Diary> {
    // userId로 familyId 찾아 넣고 일기 생성 (family table 만들고 수정 필요)
    return await this.diaryRepository.save(diary);
  }

  async updateDiary(targetId: number, diary: UpdateDiaryDto): Promise<Diary> {
    const targetDiary: Diary = await this.findOne(targetId);
    const { id, familyId, authorId, createdAt, author, mediums } = targetDiary;
    const { content } = diary;
    const updatedDiary: Diary = {
      id,
      familyId,
      authorId,
      createdAt,
      author,
      content,
      mediums,
    };
    await this.diaryRepository.update(targetId, updatedDiary);
    return await this.findOne(targetId);
  }

  async createDiaryMedium(diaryMedium: CreateMediumDto): Promise<DiaryMedium> {
    return await this.diaryMediumRepository.save(diaryMedium);
  }

  async createDiaryMediums(
    diaryId: number,
    fileNamesInS3: string[],
  ): Promise<CreateMediumsResponse> {
    const diary = await this.findOne(diaryId);
    const diaryMediums: DiaryMedium[] = [];
    for (let i = 0; i < fileNamesInS3.length; i++) {
      const medium: CreateMediumDto = {
        fileNameInS3: fileNamesInS3[i],
        diary,
        diaryId,
        order: i,
      };
      diaryMediums.push(await this.createDiaryMedium(medium));
    }
    return { diaryMediums } as CreateMediumsResponse;
  }

  async getDiaryMediumsSignedUrl(
    diaryId: number,
  ): Promise<GetSignedUrlsResponse> {
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
    return { s3Urls } as GetSignedUrlsResponse;
  }

  async getSignedUrlsForGetObject(
    fileNamesInS3: string[],
  ): Promise<GetSignedUrlsResponse> {
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

    return { s3Urls } as GetSignedUrlsResponse;
  }

  async getSignedUrlsForPutObject(
    query: PutSignedUrlsDto,
  ): Promise<PutSignedUrlsResponse> {
    const fileType: string = query.contentType.split('/')[1];
    const s3 = new AWS.S3({ useAccelerateEndpoint: true });
    const signedUrls: PutSignedUrlResponse[] = [];

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
      } as PutSignedUrlResponse;

      signedUrls.push(info);
    }

    return { signedUrls } as PutSignedUrlsResponse;
  }
}
