import {
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
import { Diary } from './diary.entity';
import { UpdateDiaryDto } from './diaryDto/update-diary.dto';
import { CreateDiaryDto } from './diaryDto/create-diary.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
<<<<<<< HEAD
import { BaseDiaryResponse } from './diaryDto/baseDiaryResponse';
import { BaseDiarysResponse } from './diaryDto/baseDiarysResponse';
import { CreateMediumsResponse } from './diaryDto/createMediumsResponse';
import { PutSignedUrlsResponse } from './diaryDto/putSignedUrlsResponse';
import { GetSignedUrlsResponse } from './diaryDto/getSignedUrlsResponse';
import { PutSignedUrlsDto } from './diaryDto/putSignedUrlsDto';
import JwtAuthGuard from '../guard/jwt.auth.guard';
=======
import { DiaryResponseDto } from './diaryDto/diary-response.dto';
import { DiarysResponseDto } from './diaryDto/diarys-response.dto';
import { ApiConfigService } from '../shared/services/api-config.service';
import { CreateMediumResponseDto } from './diaryDto/create-medium-response.dto';
import { PutSignedUrlsResponse } from './diaryDto/putSignedUrlsResponse';
import { GetPresignedUrlsResponseDto } from './diaryDto/get-presigned-urls-response.dto';
import { PutPresignedUrlsDto } from './diaryDto/put-presigned-urls.dto';
import JwtAuthGuard from '../auth/jwt/jwt.auth.guard';
>>>>>>> b4ff67b ([#22]fix: diary dto 이름 수정, jsdoc 부분 제거)

@Controller('diary')
@ApiTags('일기장 API')
@UseGuards(JwtAuthGuard)
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get('/presigned-put')
  @ApiOkResponse({ description: '성공', type: PutSignedUrlsResponse })
  @ApiOperation({
    summary: 's3 업로드용 preSigned URL 발급 api',
    description: 's3에 medium Put할 수 있는 preSigned URL들 발급 api.',
  })
  async getSignedUrlsForPutObject(
    @Query() query: PutPresignedUrlsDto,
  ): Promise<PutSignedUrlsResponse> {
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
    return await this.diaryService.getDiaryMediumsSignedUrl(diaryId);
  }

  @Post('/:diaryId/upload-mediums')
  @ApiOkResponse({ description: '성공', type: CreateMediumResponseDto })
  @ApiOperation({
    summary: '클라이언트 측의 업로드 완료 request 처리',
    description: '업로드한 medium 객체 생성 및 저장 api.',
  })
  async createMedium(
    @Param('diaryId', ParseIntPipe) diaryId: number,
    @Query('fileNamesInS3') fileNamesInS3: string[],
  ): Promise<CreateMediumResponseDto> {
    return await this.diaryService.createDiaryMedium(diaryId, fileNamesInS3);
  }

  @Get('user-diarys/:userId')
  @ApiOkResponse({ description: '성공', type: DiarysResponseDto })
  @ApiOperation({
    summary: 'getAllDiaryByUserId',
    description: '특정 id 유저의 전체 일기 리스트 받아온다.',
  })
  async findUserDiarys(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Diary[]> {
    return await this.diaryService.findAllByAuthorId(userId);
  }

  @Get('family-diarys/:userId')
  @ApiOkResponse({ description: '성공', type: DiarysResponseDto })
  @ApiOperation({
    summary: 'get family Diary By UserId',
    description: '유저를 포함한 유저 가족의 일기들을 받아온다.',
  })
  async findFamilyDiarys(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Diary[]> {
    return await this.diaryService.findAllByFamilyId(userId);
  }

  @Get(':diaryId')
  @ApiOkResponse({ description: '성공', type: DiaryResponseDto })
  @ApiOperation({
    summary: 'getDiaryByDiaryId',
    description: '특정 id로 일기 받아온다.',
  })
  async findOne(
    @Param('diaryId', ParseIntPipe) diaryId: number,
  ): Promise<Diary> {
    return await this.diaryService.findOne(diaryId);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateDiaryDto })
  @ApiOkResponse({ description: '성공', type: DiaryResponseDto })
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
  @ApiBody({ type: CreateDiaryDto })
  @ApiOkResponse({ description: '성공', type: DiaryResponseDto })
  @ApiOperation({
    summary: 'createDiaryByUserId',
    description: '특정 id 유저에 일기를 생성한다.',
  })
  async createDiary(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() diary: CreateDiaryDto,
  ): Promise<Diary> {
    return await this.diaryService.createDiary(userId, diary);
  }
}
