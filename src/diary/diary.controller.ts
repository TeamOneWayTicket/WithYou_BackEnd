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

@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get('userDiarys/:id')
  async findUserDiarys(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Diary[]> {
    return await this.diaryService.findAllByAuthorId(id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Diary> {
    return await this.diaryService.findOne(id);
  }

  @Patch(':id')
  async updateDiary(
    @Param('id', ParseIntPipe) id: number,
    @Body() diary: UpdateDiaryDto,
  ): Promise<Diary> {
    return await this.diaryService.updateDiary(id, diary);
  }

  @Post(':id')
  async createDiary(@Body() diary: CreateDiaryDto): Promise<Diary> {
    const savedDiary = await this.diaryService.createDiary(diary);

    return Object.assign({
      data: savedDiary,
      statusCode: 200,
      statusMsg: 'saved successfully',
    });
  }
}
