import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from '../entity/diary.entity';
import { DataSource, Repository } from 'typeorm';
import { UpdateDiaryDto } from '../dto/update-diary.dto';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { DiaryResponseDto } from '../dto/diary-response.dto';
import { UserService } from '../../user/service/user.service';
import { DiaryContentDto } from '../dto/diary-content.dto';
import { DiaryMediumService } from './diary.medium.service';

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

  async findAllByAuthorId(authorId: number): Promise<DiaryResponseDto[]> {
    const diaries = await this.diaryRepository.find({ where: { authorId } });
    return await Promise.all(
      diaries.map(
        async (diary) =>
          <DiaryResponseDto>{
            diary,
            mediaUrls: (
              await this.diaryMediumService.getDiaryMediaUrls(diary.id)
            ).s3Urls,
          },
      ),
    );
  }

  async findAllByFamilyId(familyId: number): Promise<DiaryResponseDto[]> {
    const diaries = await this.diaryRepository.find({ where: { familyId } });
    return await Promise.all(
      diaries.map(
        async (diary) =>
          <DiaryResponseDto>{
            diary,
            mediaUrls: (
              await this.diaryMediumService.getDiaryMediaUrls(diary.id)
            ).s3Urls,
          },
      ),
    );
  }

  async findOne(id: number): Promise<Diary> {
    return await this.diaryRepository.findOne({ where: { id } });
  }

  async findDiaryWithUrls(id: number): Promise<DiaryResponseDto> {
    const diary = await this.diaryRepository.findOne({ where: { id } });

    return {
      diary,
      mediaUrls: (await this.diaryMediumService.getDiaryMediaUrls(id)).s3Urls,
    };
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
