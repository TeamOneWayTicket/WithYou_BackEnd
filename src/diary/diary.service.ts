import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from './diary.entity';
import { Repository } from 'typeorm';
import { UpdateDiaryDto } from './diaryDto/updateDiaryDto';
import { CreateDiaryDto } from './diaryDto/createDiaryDto';
import { ApiConfigService } from '../shared/services/api-config.service';
import { DiaryMedium } from './diary.medium.entity';
import { CreateMediumDto } from './diaryDto/createMediumDto';
import { CreateMediumsDto } from './diaryDto/createMediumsDto';
import { CreateMediumsResponse } from './diaryDto/createMediumsResponse';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    @InjectRepository(DiaryMedium)
    private readonly diaryMediumRepository: Repository<DiaryMedium>,
    private readonly configService: ApiConfigService,
  ) {}

  async findAllByAuthorId(authorId: number): Promise<Diary[]> {
    return this.diaryRepository.find({ where: { authorId } });
  }

  async findOne(id: number): Promise<Diary> {
    return this.diaryRepository.findOne({ where: { id } });
  }

  async createDiary(diary: CreateDiaryDto): Promise<Diary> {
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
    mediums: CreateMediumsDto,
  ): Promise<CreateMediumsResponse> {
    const fileNames = mediums.fileNamesInS3;
    const diaryId = mediums.diaryId;
    const diary = await this.findOne(mediums.diaryId);
    const diaryMediums: DiaryMedium[] = [];
    for (let i = 0; i < fileNames.length; i++) {
      const medium: CreateMediumDto = {
        fileNameInS3: fileNames[i],
        diary,
        diaryId,
        order: i,
      };
      console.log(typeof diaryMediums);
      diaryMediums.push(await this.createDiaryMedium(medium));
    }

    return { diaryMediums } as CreateMediumsResponse;
  }
}
