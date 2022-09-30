import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiaryComment } from '../entity/diary.comment.entity';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(DiaryComment)
    private readonly diaryCommentRepository: Repository<DiaryComment>,
  ) {}
}
