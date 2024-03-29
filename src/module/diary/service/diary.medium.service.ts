import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { PutPresignedUrlsDto } from '../dto/put-presigned-urls.dto';
import { PutPresignedUrlResponseDto } from '../dto/put-presigned-url-response.dto';
import { PutSignedUrlsResponseDto } from '../dto/put-signed-urls-response.dto';
import { GetPresignedUrlsResponseDto } from '../dto/get-presigned-urls-response.dto';
import { DiaryMedium } from '../entity/diary.medium.entity';
import { CreateMediumDto } from '../dto/create-medium.dto';
import { CreateMediaResponseDto } from '../dto/create-media-response.dto';
import { Diary } from '../entity/diary.entity';

@Injectable()
export class DiaryMediumService {
  constructor(
    @InjectRepository(DiaryMedium)
    private readonly diaryMediumRepository: Repository<DiaryMedium>,
    private readonly configService: ApiConfigService,
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
  ) {
    AWS.config.update({
      region: this.configService.awsConfig.bucketRegion,
      accessKeyId: this.configService.awsConfig.accessKey,
      secretAccessKey: this.configService.awsConfig.secretAccessKey,
    });
  }

  async createDiaryMedia(
    diaryId: number,
    fileNamesInS3: string[],
  ): Promise<CreateMediaResponseDto> {
    const diary = await this.diaryRepository.findOne({
      where: { id: diaryId },
    });
    const diaryMedia: CreateMediumDto[] = [];
    for (let order = 0; order < fileNamesInS3.length; order++) {
      const medium: CreateMediumDto = {
        fileNameInS3: fileNamesInS3[order],
        diary,
        diaryId,
        order,
      };
      diaryMedia.push(medium);
    }
    return { diaryMedia: await this.diaryMediumRepository.save(diaryMedia) };
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
    dto: PutPresignedUrlsDto,
    id: number,
  ): Promise<PutSignedUrlsResponseDto> {
    const _infos = dto.mediaInfo;
    const s3 = new AWS.S3({ useAccelerateEndpoint: true });
    const signedUrls: PutPresignedUrlResponseDto[] = [];

    for (const info of _infos) {
      const fileType: string = info.contentType.split('/')[1];
      for (let i = 0; i < info.quantity; i++) {
        const fileName = `diary/${id}/${uuid()}.${fileType}`;
        const s3Url = await s3.getSignedUrlPromise('putObject', {
          Bucket: this.configService.awsConfig.bucketName,
          Key: 'origins/' + fileName,
          Expires: 3600,
        });

        signedUrls.push({ fileName, s3Url });
      }
    }

    return { signedUrls };
  }
}
