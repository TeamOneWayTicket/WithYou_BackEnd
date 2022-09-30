import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from '../entity/diary.entity';
import { DataSource, Repository } from 'typeorm';
import { UpdateDiaryDto } from '../dto/update-diary.dto';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { UserService } from '../../user/service/user.service';
import { DiaryContentDto } from '../dto/diary-content.dto';
import { DiaryMediumService } from './diary.medium.service';
import { DiariesResponseDto } from '../dto/diaries-response.dto';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    private readonly configService: ApiConfigService,
    private readonly userService: UserService,
    private readonly diaryMediumService: DiaryMediumService,
    private readonly myDataSource: DataSource,
  ) {}

  async findAllByAuthorId(authorId: number): Promise<DiariesResponseDto> {
    return {
      diaries: await this.diaryRepository.find({
        where: { authorId },
        relations: ['media'],
      }),
    };
  }

  async findAllByFamilyId(familyId: number): Promise<DiariesResponseDto> {
    return {
      diaries: await this.diaryRepository.find({
        where: { familyId },
        relations: ['media'],
      }),
    };
  }

  async findOne(id: number): Promise<Diary> {
    return await this.diaryRepository.findOne({ where: { id } });
  }

  async findDiaryWithUrls(id: number): Promise<Diary> {
    return await this.diaryRepository.findOne({
      where: { id },
      relations: ['media'],
    });
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
    return await this.findOne(targetId);
  }
}
