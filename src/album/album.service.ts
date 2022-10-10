import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaDto } from './dto/media.dto';
import { DiaryMedium } from '../module/diary/entity/diary.medium.entity';
import { Diary } from '../module/diary/entity/diary.entity';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(DiaryMedium)
    private diaryMediumRepository: Repository<DiaryMedium>,
    @InjectRepository(Diary)
    private diaryRepository: Repository<Diary>,
  ) {}

  async getFamilyPhotos(familyId: number): Promise<MediaDto> {
    const diaries = await this.diaryRepository.find({ where: { familyId } });
    const media: DiaryMedium[] = [];
    for (const diary of diaries) {
      for (const diaryMedium of diary.media) {
        media.push(diaryMedium);
      }
    }
    return { media };
  }
}
