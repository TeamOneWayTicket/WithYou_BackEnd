import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DiaryComment } from '../entity/diary.comment.entity';
import { DiaryCommentsDto } from '../dto/diary-comments.dto';
import { CreateDiaryCommentDto } from '../dto/create-diary-comment.dto';
import { DiaryCommentResponseDto } from '../dto/diary-coment-response.dto';
import { UserService } from '../../user/service/user.service';
import { getUrl } from '../../../transformer/url.transformer';

@Injectable()
export class DiaryCommentService {
  constructor(
    @InjectRepository(DiaryComment)
    private readonly diaryCommentRepository: Repository<DiaryComment>,
    private readonly userService: UserService,
    private readonly myDataSource: DataSource,
  ) {}

  async findAllComments(diaryId: number): Promise<DiaryCommentsDto> {
    return {
      comments: await this.diaryCommentRepository.find({
        where: { diaryId, isDeleted: false },
        order: { id: 'ASC' },
      }),
    };
  }

  async createComment(
    authorId: number,
    dto: CreateDiaryCommentDto,
  ): Promise<DiaryCommentResponseDto[]> {
    const queryRunner = this.myDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.diaryCommentRepository.save({ authorId, ...dto });
      return await this.getCommentsByDiaryId(dto.diaryId);
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getCommentsByDiaryId(id: number): Promise<DiaryCommentResponseDto[]> {
    const comments = await this.diaryCommentRepository.find({
      where: { diaryId: id },
    });
    comments.sort((comment1, comment2) => {
      return comment1.createdAt.compareTo(comment2.createdAt);
    });

    const commentResponse = [];

    for (const comment of comments) {
      const author = await this.userService.findOne(comment.authorId);
      commentResponse.push({
        author: author.nickname,
        thumbnail: getUrl(author.thumbnail, 480),
        comment: comment.content,
        createdAt: comment.createdAt,
      });
    }
    return commentResponse;
  }
}
