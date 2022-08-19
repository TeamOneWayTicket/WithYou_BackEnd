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
  UseGuards,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { Diary } from './entity/diary.entity';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { DiaryContentDto } from './dto/diary-content.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DiaryResponseDto } from './dto/diary-response.dto';
import { DiariesResponseDto } from './dto/diaries-response.dto';
import { PutSignedUrlsResponseDto } from './dto/put-signed-urls-response.dto';
import { GetPresignedUrlsResponseDto } from './dto/get-presigned-urls-response.dto';
import { PutPresignedUrlsDto } from './dto/put-presigned-urls.dto';
import { UserService } from '../user/service/user.service';
import JwtAuthGuard from '../../guard/jwt.auth.guard';
import { CreateMediaResponseDto } from './dto/create-media-response.dto';

@Controller('diary')
@ApiTags('일기장 API')
@UseGuards(JwtAuthGuard)
export class DiaryController {
  constructor(
    private readonly diaryService: DiaryService,
    private readonly userService: UserService,
  ) {}

  @Get('/presigned-put')
  @ApiOkResponse({ description: '성공', type: PutSignedUrlsResponseDto })
  @ApiOperation({
    summary: 's3 업로드용 preSigned URL 발급 api',
    description: 's3에 medium Put할 수 있는 preSigned URL들 발급 api.',
  })
  async getSignedUrlsForPutObject(
    @Query() query: PutPresignedUrlsDto,
  ): Promise<PutSignedUrlsResponseDto> {
    return await this.diaryService.getSignedUrlsForPutObject(query);
  }

  @Get('/presigned-get')
  @ApiOkResponse({ description: '성공', type: GetPresignedUrlsResponseDto })
  @ApiOperation({
    summary: 's3 다운로드용 preSigned URL 발급 api',
    description: 's3에서 특정 객체 Get할 수 있는 preSigned URL들 발급 api.',
  })
  async getSignedUrlsForGetObject(
    @Query('fileNamesInS3') fileNamesInS3: string[],
  ): Promise<GetPresignedUrlsResponseDto> {
    return await this.diaryService.getSignedUrlsForGetObject(fileNamesInS3);
  }

  @Get('/:diaryId/presigned-put')
  @ApiOkResponse({ description: '성공', type: GetPresignedUrlsResponseDto })
  @ApiOperation({
    summary: '특정 일기 medium 의 다운로드용 preSigned URL 들 가져오는 api',
    description: '특정 일기 medium 의 다운로드용 preSigned URL 들 가져오는 api',
  })
  async getDiarySignedUrls(
    @Param('diaryId', ParseIntPipe) diaryId: number,
  ): Promise<GetPresignedUrlsResponseDto> {
    return await this.diaryService.getDiaryMediaUrls(diaryId);
  }

  @Post('/:diaryId/upload-mediums')
  @ApiOkResponse({ description: '성공', type: CreateMediaResponseDto })
  @ApiOperation({
    summary: '클라이언트 측의 업로드 완료 request 처리',
    description: '업로드한 medium 객체 생성 및 저장 api.',
  })
  async createMedium(
    @Param('diaryId', ParseIntPipe) diaryId: number,
    @Query('fileNamesInS3') fileNamesInS3: string[],
  ): Promise<CreateMediaResponseDto> {
    return await this.diaryService.createDiaryMedia(diaryId, fileNamesInS3);
  }

  @Get('user-diaries/:userId')
  @ApiOkResponse({ description: '성공', type: DiariesResponseDto })
  @ApiOperation({
    summary: 'getAllDiaryByUserId',
    description: '특정 id 유저의 전체 일기 리스트 받아온다.',
  })
  async findUserDiarys(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<DiaryResponseDto[]> {
    return await this.diaryService.findAllByAuthorId(userId);
  }

  @Get('family-diarys/:userId')
  @ApiOkResponse({ description: '성공', type: DiariesResponseDto })
  @ApiOperation({
    summary: 'get family Diary By UserId',
    description: '유저를 포함한 유저 가족의 일기들을 받아온다.',
  })
  async findFamilyDiarys(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<DiaryResponseDto[]> {
    return await this.diaryService.findAllByFamilyId(userId);
  }

  @Get(':diaryId')
  @ApiOkResponse({ description: '성공', type: DiaryResponseDto })
  @ApiOperation({
    summary: 'get diary and urls by diaryId',
    description: '특정 id로 일기 받아온다.',
  })
  async findDiaryWithMediumUrls(
    @Param('diaryId', ParseIntPipe) diaryId: number,
  ): Promise<DiaryResponseDto> {
    return await this.diaryService.findDiaryWithUrls(diaryId);
  }

  @Patch(':diaryId')
  @ApiBody({ type: UpdateDiaryDto })
  @ApiOkResponse({ description: '성공', type: Diary })
  @ApiOperation({
    summary: 'editDiaryByDiaryId',
    description: '특정 id 일기 내용 입력한 내용으로 수정한다.',
  })
  async updateDiary(
    @Param('diaryId', ParseIntPipe) diaryId: number,
    @Body() diary: UpdateDiaryDto,
  ): Promise<Diary> {
    return await this.diaryService.updateDiary(diaryId, diary);
  }

  @Post(':userId')
  @ApiBody({ type: DiaryContentDto })
  @ApiOkResponse({ description: '성공', type: Diary })
  @ApiOperation({
    summary: 'create Diary By UserId',
    description: '특정 id 유저에 일기를 생성한다.',
  })
  async createDiary(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() diary: DiaryContentDto,
  ): Promise<Diary> {
    if (await this.userService.hasMinimumInfo(userId)) {
      return await this.diaryService.createDiary(userId, diary.content);
    } else {
      throw new BadRequestException('유효하지 않은 유저입니다');
    }
  }
}
