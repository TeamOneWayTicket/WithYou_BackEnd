import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumMediaDto } from './dto/album.media.dto';
import { DiaryMedium } from '../diary/entity/diary.medium.entity';
import { Diary } from '../diary/entity/diary.entity';
import { ApiConfigService } from '../../shared/services/api-config.service';
import _ from 'lodash';
import { getUrl } from '../../transformer/url.transformer';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(DiaryMedium)
    private readonly diaryMediumRepository: Repository<DiaryMedium>,
    private readonly configService: ApiConfigService,
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
  ) {}

  async getFamilyPhotos(familyId: number): Promise<AlbumMediaDto> {
    const diaries = await this.diaryRepository.find({
      where: { familyId },
      relations: ['media'],
    });
    const media = await Promise.all(
      _.flatMap(diaries, (item) => {
        return _(item.media)
          .map(async function (value) {
            return {
              diaryId: value.diaryId,
              url: getUrl(value.fileNameInS3, 480),
            };
          })
          .value();
      }),
    );
    return { media };
  }
}
