import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumMediaDto } from './dto/album.media.dto';
import { DiaryMedium } from '../diary/entity/diary.medium.entity';
import { Diary } from '../diary/entity/diary.entity';
import AWS from 'aws-sdk';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { AlbumMediumDto } from './dto/album.medium.dto';

@Injectable()
export class AlbumService {
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

  async getFamilyPhotos(familyId: number): Promise<AlbumMediaDto> {
    const s3 = new AWS.S3({ useAccelerateEndpoint: true });
    const diaries = await this.diaryRepository.find({
      where: { familyId },
      relations: ['media'],
    });
    const media: AlbumMediumDto[] = [];
    for (const diary of diaries) {
      for (const diaryMedium of diary.media) {
        media.push({
          diaryId: diaryMedium.diaryId,
          url: await s3.getSignedUrlPromise('getObject', {
            Bucket: this.configService.awsConfig.bucketName,
            Key: diaryMedium.fileNameInS3,
            Expires: 36000,
          }),
        });
      }
    }
    return { media };
  }
}
