import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { Diary } from './diary.entity';
import { UpdateDiaryDto } from './diaryDto/updateDiaryDto';
import { CreateDiaryDto } from './diaryDto/createDiaryDto';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseDiaryResponse } from './diaryDto/baseDiaryResponse';
import { BaseDiarysResponse } from './diaryDto/baseDiarysResponse';

@Controller('diary')
@ApiTags('일기장 API')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get('userDiarys/:id')
  @ApiCreatedResponse({ description: '성공', type: BaseDiarysResponse })
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
  @ApiCreatedResponse({ description: '성공', type: BaseDiaryResponse })
  @ApiOperation({
    summary: '특정 일기 가지고 오는 API',
    description: '특정 id로 일기 받아온다.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Diary> {
    return await this.diaryService.findOne(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ description: '성공', type: BaseDiaryResponse })
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
  @ApiCreatedResponse({ description: '성공', type: BaseDiaryResponse })
  @ApiOperation({
    summary: '특정 id 유저의 일기 생성 API',
    description: '특정 id 유저에 일기를 생성한다.',
  })
  async createDiary(@Body() diary: CreateDiaryDto): Promise<Diary> {
    const savedDiary = await this.diaryService.createDiary(diary);

    return await this.diaryService.findOne(savedDiary.id);
  }
}
