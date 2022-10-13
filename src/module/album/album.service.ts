import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumMediaDto } from './dto/album.media.dto';
import { DiaryMedium } from '../diary/entity/diary.medium.entity';
import { Diary } from '../diary/entity/diary.entity';
import AWS from 'aws-sdk';
import { ApiConfigService } from '../../shared/services/api-config.service';
import _ from 'lodash';

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
    const bucketName = this.configService.awsConfig.bucketName;
    const media = await Promise.all(
      _.flatMap(diaries, (item) => {
        return _(item.media)
          .flatMap(async function (value) {
            return {
              diaryId: value.diaryId,
              url: await s3.getSignedUrlPromise('getObject', {
                Bucket: bucketName,
                Key: value.fileNameInS3,
                Expires: 36000,
              }),
            };
          })
          .value();
      }),
    );
    return { media };
  }
}
