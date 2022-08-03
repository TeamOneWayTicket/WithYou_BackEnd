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
import { UpdateDiaryDto } from './diaryDto/updateDiaryDto';
import { CreateDiaryDto } from './diaryDto/createDiaryDto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseDiaryResponse } from './diaryDto/baseDiaryResponse';
import { BaseDiarysResponse } from './diaryDto/baseDiarysResponse';
import { ApiConfigService } from '../shared/services/api-config.service';
import { CreateMediumsResponse } from './diaryDto/createMediumsResponse';
import { PutSignedUrlsResponse } from './diaryDto/putSignedUrlsResponse';
import { GetSignedUrlsResponse } from './diaryDto/getSignedUrlsResponse';
import { PutSignedUrlsDto } from './diaryDto/putSignedUrlsDto';
import JwtAuthGuard from '../auth/jwt/jwt.auth.guard';

@Controller('diary')
@ApiTags('일기장 API')
@UseGuards(JwtAuthGuard)
export class DiaryController {
  constructor(
    private readonly diaryService: DiaryService,
    private readonly configService: ApiConfigService,
  ) {}

  @Get('/presigned-put')
  @ApiOkResponse({ description: '성공', type: PutSignedUrlsResponse })
  @ApiOperation({
    summary: 's3 업로드용 preSigned URL 발급 api',
    description: 's3에 medium Put할 수 있는 preSigned URL들 발급 api.',
  })
  async getSignedUrlsForPutObject(
    @Query() query: PutSignedUrlsDto,
  ): Promise<PutSignedUrlsResponse> {
    return await this.diaryService.getSignedUrlsForPutObject(query);
  }

  @Get('/presigned-get')
  @ApiOkResponse({ description: '성공', type: GetSignedUrlsResponse })
  @ApiOperation({
    summary: 's3 다운로드용 preSigned URL 발급 api',
    description: 's3에서 특정 객체 Get할 수 있는 preSigned URL들 발급 api.',
  })
  async getSignedUrlsForGetObject(
    @Query('fileNamesInS3') fileNamesInS3: string[],
  ): Promise<GetSignedUrlsResponse> {
    return await this.diaryService.getSignedUrlsForGetObject(fileNamesInS3);
  }

  @Get('/:diaryId/presigned-put')
  @ApiOkResponse({ description: '성공', type: GetSignedUrlsResponse })
  @ApiOperation({
    summary: '특정 일기 medium 의 다운로드용 preSigned URL 들 가져오는 api',
    description: '특정 일기 medium 의 다운로드용 preSigned URL 들 가져오는 api',
  })
  async getDiarySignedUrls(
    @Param('diaryId', ParseIntPipe) diaryId: number,
  ): Promise<GetSignedUrlsResponse> {
    return await this.diaryService.getDiaryMediumsSignedUrl(diaryId);
  }

  @Post('/:diaryId/upload-mediums')
  @ApiOkResponse({ description: '성공', type: CreateMediumsResponse })
  @ApiOperation({
    summary: '클라이언트 측의 업로드 완료 request 처리',
    description: '업로드한 medium 객체 생성 및 저장 api.',
  })
  async createMediums(
    @Param('diaryId', ParseIntPipe) diaryId: number,
    @Query('fileNamesInS3') fileNamesInS3: string[],
  ): Promise<CreateMediumsResponse> {
    return await this.diaryService.createDiaryMediums(diaryId, fileNamesInS3);
  }

  @Get('userDiarys/:id')
  @ApiOkResponse({ description: '성공', type: BaseDiarysResponse })
  @ApiOperation({
    summary: '특정 유저의 전체 일기 리스트 API',
    description: '특정 id 유저의 전체 일기 리스트 받아온다.',
  })
  async findUserDiarys(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Diary[]> {
    return await this.diaryService.findAllByAuthorId(id);
  }

  @Get(':id')
  @ApiOkResponse({ description: '성공', type: BaseDiaryResponse })
  @ApiOperation({
    summary: '특정 일기 가지고 오는 API',
    description: '특정 id로 일기 받아온다.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Diary> {
    return await this.diaryService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateDiaryDto })
  @ApiOkResponse({ description: '성공', type: BaseDiaryResponse })
  @ApiOperation({
    summary: '특정 일기 내용 수정 API',
    description: '특정 id 일기 내용 입력한 내용으로 수정한다.',
  })
  async updateDiary(
    @Param('id', ParseIntPipe) id: number,
    @Body() diary: UpdateDiaryDto,
  ): Promise<Diary> {
    return await this.diaryService.updateDiary(id, diary);
  }

  @Post(':id')
  @ApiBody({ type: CreateDiaryDto })
  @ApiOkResponse({ description: '성공', type: BaseDiaryResponse })
  @ApiOperation({
    summary: '특정 id 유저의 일기 생성 API',
    description: '특정 id 유저에 일기를 생성한다.',
  })
  async createDiary(@Body() diary: CreateDiaryDto): Promise<Diary> {
    const savedDiary = await this.diaryService.createDiary(diary);

    return await this.diaryService.findOne(savedDiary.id);
  }

  @Get('/test')
  async getSignedUrlForProductImage2() {
    console.log('hello');
  }
}
