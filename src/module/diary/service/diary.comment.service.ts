import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiaryComment } from '../entity/diary.comment.entity';
import { DiaryCommentsDto } from '../dto/diary-comments.dto';
import { CreateDiaryCommentDto } from '../dto/create-diary-comment.dto';

@Injectable()
export class DiaryCommentService {
  constructor(
    @InjectRepository(DiaryComment)
    private readonly diaryCommentRepository: Repository<DiaryComment>,
  ) {}

  async findAllComments(diaryId: number): Promise<DiaryCommentsDto> {
    return {
      comments: await this.diaryCommentRepository.find({ where: { diaryId } }),
    };
  }

  async createComment(
    authorId: number,
    dto: CreateDiaryCommentDto,
  ): Promise<DiaryComment> {
    return await this.diaryCommentRepository.save({ authorId, ...dto });
  }
}
