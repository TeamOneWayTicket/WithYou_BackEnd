import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DiaryService } from '../service/diary.service';
import { Diary } from '../entity/diary.entity';
import { UpdateDiaryDto } from '../dto/update-diary.dto';
import { DiaryContentDto } from '../dto/diary-content.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DiariesResponseDto } from '../dto/diaries-response.dto';
import { UserService } from '../../user/service/user.service';
import { User } from '../../user/entity/user.entity';
import { UserParam } from '../../../decorator/user.decorator';
import { Auth } from '../../../decorator/http.decorator';
import { Role } from '../../../common/enum/role.enum';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DiariesInfiniteResponseDto } from '../dto/diaries-infinite-response.dto';

@Controller('diary')
@ApiTags('일기장 API')
export class DiaryController {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    private readonly diaryService: DiaryService,
    private readonly userService: UserService,
  ) {}

  @Get('my')
  @Auth(Role.User)
  @ApiOkResponse({ description: '성공', type: DiariesInfiniteResponseDto })
  @ApiOperation({
    summary: 'get my resized diaries (infinite scroll)',
    description:
      'nextId부터 take 갯수 만큼 일기+ 끝인지 알 수 있는 isLast 값 리턴',
  })
  async infiniteScrollResizedMyDiaries(
    @UserParam() user: User,
    @Query('nextId', ParseIntPipe) nextId: number,
    @Query('take', ParseIntPipe) take: number,
  ): Promise<DiariesInfiniteResponseDto> {
    if (!nextId) {
      nextId = await this.diaryService.getMyDiariesLatestId(user.id);
    }
    return await this.diaryService.getMyDiaries(user.id, nextId, take, 480);
  }

  @Get('my/all')
  @Auth(Role.User)
  @ApiOkResponse({ description: '성공', type: DiariesResponseDto })
  @ApiOperation({
    summary: 'get user Diaries',
    description: '현재 유저의 전체 일기 리스트 받아온다.',
  })
  async getUserDiaries(@UserParam() user: User): Promise<DiariesResponseDto> {
    return await this.diaryService.findAllByAuthorId(user.id);
  }

  @Get('family')
  @Auth(Role.User)
  @ApiOkResponse({ description: '성공', type: DiariesInfiniteResponseDto })
  @ApiOperation({
    summary: 'get family resized diaries (infinite scroll)',
    description:
      'nextId부터 take 갯수 만큼 일기+ 끝인지 알 수 있는 isLast 값 리턴',
  })
  async infiniteScrollResizedFamilyDiaries(
    @UserParam() user: User,
    @Query('nextId', ParseIntPipe) nextId: number,
    @Query('take', ParseIntPipe) take: number,
  ): Promise<DiariesInfiniteResponseDto> {
    if (!nextId) {
      nextId = await this.diaryService.getFamilyDiariesLatestId(user.familyId);
    }
    return await this.diaryService.getFamilyDiaries(
      user.familyId,
      nextId,
      take,
      480,
    );
  }

  @Get('family/all')
  @Auth(Role.User)
  @ApiOkResponse({ description: '성공', type: DiariesResponseDto })
  @ApiOperation({
    summary: 'get user family Diaries',
    description: '유저를 포함한 유저 가족의 일기들을 받아온다.',
  })
  async findFamilyAllDiaries(
    @UserParam() user: User,
  ): Promise<DiariesResponseDto> {
    return await this.diaryService.findAllByFamilyId(user.familyId);
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
    summary: 'create Diary By UserId',
    description: '특정 id 유저에 일기를 생성한다.',
  })
  async createDiary(
    @UserParam() user: User,
    @Body() dto: DiaryContentDto,
  ): Promise<Diary> {
    if (!(await this.userService.hasMinimumInfo(user.id))) {
      throw new BadRequestException('유효하지 않은 유저입니다');
    }
    return await this.diaryService.createDiary(user.id, dto);
  }
}
