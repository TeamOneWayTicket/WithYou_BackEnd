import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from './diary.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private diaryRepository: Repository<Diary>,
  ) {}

  async findAllByAuthorId(authorId: number): Promise<Diary[]> {
    return this.diaryRepository.find({ where: { authorId: authorId } });
  }

  async findOne(id: number): Promise<Diary> {
    return this.diaryRepository.findOne({ where: { id } });
  }

  async saveDiary(diary: Diary): Promise<Diary> {
    return await this.diaryRepository.save(diary);
  }

  async updateDiary(targetId: number, diary: Diary): Promise<Diary> {
    const targetDiary: Diary = await this.findOne(targetId);
    const { id, familyId, authorId, createdAt, author } = targetDiary;
    const { content } = diary;
    const updatedDiary: Diary = {
      id,
      familyId,
      authorId,
      createdAt,
      author,
      content,
    };
    await this.diaryRepository.update(targetId, updatedDiary);
    return updatedDiary;
  }
}
