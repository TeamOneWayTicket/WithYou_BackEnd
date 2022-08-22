import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from './entity/diary.entity';
import { DataSource, Repository } from 'typeorm';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { ApiConfigService } from '../../shared/services/api-config.service';
import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { PutPresignedUrlsDto } from './dto/put-presigned-urls.dto';
import { PutPresignedUrlResponseDto } from './dto/put-presigned-url-response.dto';
import { PutSignedUrlsResponseDto } from './dto/put-signed-urls-response.dto';
import { GetPresignedUrlsResponseDto } from './dto/get-presigned-urls-response.dto';
import { DiaryResponseDto } from './dto/diary-response.dto';
import { UserService } from '../user/service/user.service';
import { DiaryMedium } from './entity/diary.medium.entity';
import { CreateMediumDto } from './dto/create-medium.dto';
import { CreateMediaResponseDto } from './dto/create-media-response.dto';
import { DiaryContentDto } from './dto/diary-content.dto';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    @InjectRepository(DiaryMedium)
    private readonly diaryMediumRepository: Repository<DiaryMedium>,
    private readonly configService: ApiConfigService,
    private readonly userService: UserService,
    private myDataSource: DataSource,
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
      diariesWithUrl.push({
        diary: diary,
        mediaUrls: (await this.getDiaryMediaUrls(diary.id)).s3Urls,
      });
    }
    return diariesWithUrl;
  }

  async findAllByFamilyId(familyId: number): Promise<DiaryResponseDto[]> {
    const diaries = await this.diaryRepository.find({ where: { familyId } });
    return await Promise.all(
      diaries.map(
        async (diary) =>
          <DiaryResponseDto>{
            diary,
            mediaUrls: (await this.getDiaryMediaUrls(diary.id)).s3Urls,
          },
      ),
    );
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

  async createDiary(
    authorId: number,
    diarySource: DiaryContentDto,
  ): Promise<Diary> {
    const queryRunner = this.myDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let diary: Diary;
    try {
      const familyId = (await this.userService.findOne(authorId)).familyId;
      diary = await this.diaryRepository.save({
        authorId,
        content: diarySource.content,
        familyId,
      });
      await this.createDiaryMedia(diary.id, diarySource.fileNamesInS3);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return diary;
  }

  async updateDiary(targetId: number, diary: UpdateDiaryDto): Promise<Diary> {
    const { content } = diary;
    await this.diaryRepository.update(targetId, {
      content,
    });
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
      diaryMedia.push(
        await this.createDiaryMedium({
          fileNameInS3: fileNamesInS3[i],
          diary,
          diaryId,
          order: i,
        }),
      );
    }
    return { diaryMedia };
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
      s3Urls.push(
        await s3.getSignedUrlPromise('getObject', {
          Bucket: this.configService.awsConfig.bucketName,
          Key: medium.fileNameInS3,
          Expires: 3600,
        }),
      );
    }
    return { s3Urls };
  }

  async getSignedUrlsForGetObject(
    fileNamesInS3: string[],
  ): Promise<GetPresignedUrlsResponseDto> {
    const s3 = new AWS.S3({ useAccelerateEndpoint: true });
    const s3Urls: string[] = [];
    for (let i = 0; i < fileNamesInS3.length; i++) {
      s3Urls.push(
        await s3.getSignedUrlPromise('getObject', {
          Bucket: this.configService.awsConfig.bucketName,
          Key: fileNamesInS3[i],
          Expires: 3600,
        }),
      );
    }
    return { s3Urls };
  }

  async getSignedUrlsForPutObject(
    body: PutPresignedUrlsDto,
  ): Promise<PutSignedUrlsResponseDto> {
    const _infos = body.mediaInfo;
    const s3 = new AWS.S3({ useAccelerateEndpoint: true });
    const signedUrls: PutPresignedUrlResponseDto[] = [];

    for (const info of _infos) {
      const fileType: string = info.contentType.split('/')[1];
      for (let i = 0; i < info.quantity; i++) {
        const fileName = `diary/${uuid()}.${fileType}`;
        const s3Url = await s3.getSignedUrlPromise('putObject', {
          Bucket: this.configService.awsConfig.bucketName,
          Key: fileName,
          Expires: 3600,
        });

        signedUrls.push({ fileName, s3Url });
      }
    }

    return { signedUrls };
  }
}
