import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from '../entity/diary.entity';
import { DataSource, LessThanOrEqual, Repository } from 'typeorm';
import { UpdateDiaryDto } from '../dto/update-diary.dto';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { UserService } from '../../user/service/user.service';
import { DiaryContentDto } from '../dto/diary-content.dto';
import { DiaryMediumService } from './diary.medium.service';
import { DiariesResponseDto } from '../dto/diaries-response.dto';
import { DiaryResponseDto } from '../dto/diary-response.dto';
import { DiaryComment } from '../entity/diary.comment.entity';
import { DiariesInfiniteResponseDto } from '../dto/diaries-infinite-response.dto';
import { getUrl } from '../../../transformer/url.transformer';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    private readonly configService: ApiConfigService,
    private readonly userService: UserService,
    private readonly diaryMediumService: DiaryMediumService,
    private readonly myDataSource: DataSource,
    @InjectRepository(DiaryComment)
    private readonly diaryCommentRepository: Repository<DiaryComment>,
  ) {}

  async getMyDiariesLatestId(id: number): Promise<number> {
    const recentDiary = await this.diaryRepository
      .createQueryBuilder('diary')
      .select('id')
      .where('diary.authorId = :id', { id })
      .orderBy('id', 'DESC')
      .getRawOne();
    if (!recentDiary) {
      return 0;
    }
    return recentDiary.id;
  }

  async getFamilyDiariesLatestId(familyId: number): Promise<number> {
    const recentDiary = await this.diaryRepository
      .createQueryBuilder('diary')
      .select('id')
      .where('diary.familyId = :familyId', { familyId })
      .orderBy('id', 'DESC')
      .getRawOne();
    if (!recentDiary) {
      return 0;
    }
    return recentDiary.id;
  }

  async findAllByAuthorId(authorId: number): Promise<DiariesResponseDto> {
    const diaries = await this.diaryRepository.find({
      where: { authorId },
      relations: ['media'],
    });
    const diariesResponse: DiaryResponseDto[] = [];
    for (const diary of diaries) {
      diariesResponse.push({
        diary,
        commentCount: await this.diaryCommentRepository.count({
          where: { diaryId: diary.id, isDeleted: false },
        }),
      });
    }
    return { diaries: diariesResponse };
  }

  async findAllByFamilyId(familyId: number): Promise<DiariesResponseDto> {
    const diaries = await this.diaryRepository.find({
      where: { familyId },
      relations: ['media'],
    });
    const diariesResponse: DiaryResponseDto[] = [];
    for (const diary of diaries) {
      diariesResponse.push({
        diary,
        commentCount: await this.diaryCommentRepository.count({
          where: { diaryId: diary.id, isDeleted: false },
        }),
      });
    }
    return { diaries: diariesResponse };
  }

  async getFamilyDiaries(
    familyId: number,
    nextId: number,
    take: number,
    size: number,
  ): Promise<DiariesInfiniteResponseDto> {
    if (!nextId) {
      nextId = await this.getFamilyDiariesLatestId(familyId);
    }
    const diaries = await this.diaryRepository.find({
      where: { familyId, id: LessThanOrEqual(nextId) },
      relations: ['media'],
      take: take + 1,
      order: { id: 'DESC' },
    });
    const diariesResponse: DiaryResponseDto[] = [];

    for (const diary of diaries) {
      for (const medium of diary.media) {
        medium.fileNameInS3 = getUrl(medium.fileNameInS3, size);
      }
      diariesResponse.push({
        diary,
        commentCount: await this.diaryCommentRepository.count({
          where: { diaryId: diary.id, isDeleted: false },
        }),
      });
    }
    if (diariesResponse.length == take + 1)
      return {
        diaries: diariesResponse.slice(0, take),
        nextId: diariesResponse[take].diary.id,
        isLast: false,
      };

    return { diaries: diariesResponse, nextId: 0, isLast: true };
  }

  async getMyDiaries(
    authorId: number,
    nextId: number,
    take: number,
    size: number,
  ): Promise<DiariesInfiniteResponseDto> {
    if (!nextId) {
      nextId = await this.getMyDiariesLatestId(authorId);
    }
    const diaries = await this.diaryRepository.find({
      where: { authorId, id: LessThanOrEqual(nextId) },
      relations: ['media'],
      take: take + 1,
      order: { id: 'DESC' },
    });
    const diariesResponse: DiaryResponseDto[] = [];

    for (const diary of diaries) {
      for (const medium of diary.media) {
        medium.fileNameInS3 = getUrl(medium.fileNameInS3, size);
      }
      diariesResponse.push({
        diary,
        commentCount: await this.diaryCommentRepository.count({
          where: { diaryId: diary.id, isDeleted: false },
        }),
      });
    }
    if (diariesResponse.length == take + 1)
      return {
        diaries: diariesResponse.slice(0, take),
        nextId: diariesResponse[take].diary.id,
        isLast: false,
      };

    return { diaries: diariesResponse, nextId: 0, isLast: true };
  }

  async findDiaryWithUrls(id: number): Promise<Diary> {
    const diary = await this.diaryRepository.findOne({
      where: { id },
      relations: ['media'],
    });
    for (const medium of diary.media) {
      medium.fileNameInS3 = getUrl(medium.fileNameInS3, 0);
    }
    return diary;
  }

  async createDiary(
    authorId: number,
    diarySource: DiaryContentDto,
  ): Promise<Diary> {
    const queryRunner = this.myDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let diary: Diary;
    try {
      const familyId = (await this.userService.findOne(authorId)).familyId;
      diary = await this.diaryRepository.save({
        authorId,
        content: diarySource.content,
        familyId,
      });
      await this.diaryMediumService.createDiaryMedia(
        diary.id,
        diarySource.fileNamesInS3,
      );
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return diary;
  }

  async updateDiary(targetId: number, diary: UpdateDiaryDto): Promise<Diary> {
    const { content } = diary;
    await this.diaryRepository.update(targetId, {
      content,
    });
    return await this.diaryRepository.findOne({ where: { id: targetId } });
  }
}
