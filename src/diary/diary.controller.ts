import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { Diary } from './diary.entity';
import { UpdateDiaryDto } from './diaryDto/updateDiaryDto';
import { CreateDiaryDto } from './diaryDto/createDiaryDto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseDiaryResponse } from './diaryDto/baseDiaryResponse';
import { BaseDiarysResponse } from './diaryDto/baseDiarysResponse';
import { v4 as uuid } from 'uuid';
import { ApiConfigService } from '../shared/services/api-config.service';
import AWS from 'aws-sdk';
import { PutSignedUrlDto } from './diaryDto/putSignedUrlDto';
import { GetSignedUrlDto } from './diaryDto/getSignedUrlDto';
import { PutSignedUrlResponse } from './diaryDto/putSignedUrlResponse';
import { GetSignedUrlResponse } from './diaryDto/getSignedUrlResponse';
import { CreateMediumsDto } from './diaryDto/createMediumsDto';

@Controller('diary')
@ApiTags('일기장 API')
export class DiaryController {
  constructor(
    private readonly diaryService: DiaryService,
    private readonly config: ApiConfigService,
  ) {}

  @Get('/putSignedUrl')
  @ApiOkResponse({ description: '성공', type: PutSignedUrlResponse })
  @ApiOperation({
    summary: 'preSigned URL 발급 api',
    description: 's3에 특정 객체 Put할 수 있는 preSigned URL 발급 api.',
  })
  async getSignedUrlForPutObject(
    @Body() input: PutSignedUrlDto,
  ): Promise<PutSignedUrlResponse> {
    const filetype: string = input.contentType.split('/')[1];
    const fileName = `${input.userId}/${uuid()}.${filetype}`;

    AWS.config.update({
      region: this.config.awsConfig.bucketRegion,
      accessKeyId: this.config.awsConfig.accessKey,
      secretAccessKey: this.config.awsConfig.secretAccessKey,
    });
    const s3 = new AWS.S3({ useAccelerateEndpoint: true });

    const s3Url = await s3.getSignedUrlPromise('putObject', {
      Bucket: this.config.awsConfig.bucketName,
      Key: fileName,
      Expires: 3600,
      //ContentType: input.contentType,
    });

    return {
      fileName,
      s3Url,
    };
  }

  @Get('/getSignedUrl')
  @ApiOkResponse({ description: '성공', type: GetSignedUrlResponse })
  @ApiOperation({
    summary: 'preSigned URL 발급 api',
    description: 's3에서 특정 객체 Get할 수 있는 preSigned URL 발급 api.',
  })
  async getSignedUrlForGetObject(
    @Body() input: GetSignedUrlDto,
  ): Promise<GetSignedUrlResponse> {
    AWS.config.update({
      region: this.config.awsConfig.bucketRegion,
      accessKeyId: this.config.awsConfig.accessKey,
      secretAccessKey: this.config.awsConfig.secretAccessKey,
    });
    const s3 = new AWS.S3({ useAccelerateEndpoint: true });

    const s3Url = await s3.getSignedUrlPromise('getObject', {
      Bucket: this.config.awsConfig.bucketName,
      Key: input.fileNameInS3,
      Expires: 3600,
    });

    const res = {
      s3Url,
    } as GetSignedUrlResponse;
    return res;
  }

  @Get('/saveMediums')
  @ApiOkResponse({ description: '성공', type: GetSignedUrlResponse })
  @ApiOperation({
    summary: '업로드 완료 request 처리',
    description: '업로드할 mediums 객체 생성 api.',
  })
  async createMediums(@Body() input: CreateMediumsDto): Promise<void> {
    await this.diaryService.createDiaryMediums(input);
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
