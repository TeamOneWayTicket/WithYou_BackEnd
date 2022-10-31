import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { DiaryService } from '../service/diary.service';
import { Diary } from '../entity/diary.entity';
import { UpdateDiaryDto } from '../dto/update-diary.dto';
import { DiaryContentDto } from '../dto/diary-content.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../../user/service/user.service';
import { User } from '../../user/entity/user.entity';
import { UserParam } from '../../../decorator/user.decorator';
import { Auth } from '../../../decorator/http.decorator';
import { Role } from '../../../common/enum/role.enum';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DiariesInfiniteResponseDto } from '../dto/diaries-infinite-response.dto';
import { DiariesResponseDto } from '../dto/diaries-response.dto';
import { FamilyDiaryQueryDto } from '../dto/family-diary-queury.dto';
import { LocalDateTime, LocalTime } from '@js-joda/core';

@Controller('diary/recommend')
@ApiTags('일기장 API')
export class RecommendDiaryController {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    private readonly diaryService: DiaryService,
    private readonly userService: UserService,
  ) {}

  @Get(':date')
  @Auth(Role.User)
  @ApiOkResponse({ description: '성공', type: DiariesInfiniteResponseDto })
  @ApiOperation({
    summary: 'get family resized diaries (infinite scroll)',
    description: '가족 추천 로그들 가져오기',
  })
  async getFamilyDiaries(
    @UserParam() user: User,
    @Param() dto: FamilyDiaryQueryDto,
  ): Promise<DiariesResponseDto> {
    return await this.diaryService.getFamilyDiariesByDay(
      user.familyId,
      'recommend',
      480,
      LocalDateTime.of(dto.date, LocalTime.MIDNIGHT),
    );
  }

  @Get(':diaryId')
  @Auth(Role.User)
  @ApiOkResponse({ description: '성공', type: Diary })
  @ApiOperation({
    summary: 'get diary and urls by diaryId',
    description: '특정 id로 일기 받아온다.',
  })
  async findDiaryWithMediumUrls(
    @Param('diaryId', ParseIntPipe) diaryId: number,
  ): Promise<Diary> {
    return await this.diaryService.findDiaryWithUrls(diaryId);
  }

  @Patch(':id')
  @Auth(Role.User)
  @ApiBody({ type: UpdateDiaryDto })
  @ApiOkResponse({ description: '성공', type: Diary })
  @ApiOperation({
    summary: 'editDiaryByDiaryId',
    description: '특정 id 일기 내용 입력한 내용으로 수정한다.',
  })
  async updateDiary(
    @Param('id', ParseIntPipe) diaryId: number,
    @Body() diary: UpdateDiaryDto,
  ): Promise<Diary> {
    return await this.diaryService.updateDiary(diaryId, diary);
  }

  @Post()
  @Auth(Role.User)
  @ApiBody({ type: DiaryContentDto })
  @ApiOkResponse({ description: '성공', type: Diary })
  @ApiOperation({
    summary: 'create Family Diary By UserId',
    description: '특정 id 유저에 일기를 생성한다.',
  })
  async createDiary(
    @UserParam() user: User,
    @Body() dto: DiaryContentDto,
  ): Promise<Diary> {
    if (!(await this.userService.hasMinimumInfo(user.id))) {
      throw new BadRequestException('유효하지 않은 유저입니다');
    }
    return await this.diaryService.createDiary(user.id, 'recommend', dto);
  }
}
