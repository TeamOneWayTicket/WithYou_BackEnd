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
    const diaries = await this.diaryRepository.find({
      where: { familyId },
      relations: ['media'],
    });
    const cf = this.configService.awsConfig.cfAddress;
    const media = await Promise.all(
      _.flatMap(diaries, (item) => {
        return _(item.media)
          .map(async function (value) {
            return {
              diaryId: value.diaryId,
              url: cf + value.fileNameInS3,
            };
          })
          .value();
      }),
    );
    return { media };
  }
}
