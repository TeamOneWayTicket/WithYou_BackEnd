import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { Diary } from './diary.entity';

@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get('userDiarys/:id')
  async findUserDiarys(@Param('id') id: number): Promise<Diary[]> {
    return await this.diaryService.findAllByAuthorId(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Diary> {
    return await this.diaryService.findOne(id);
  }

  @Patch(':id')
  async updateDiary(
    @Param('id') id: number,
    @Body() diary: Diary,
  ): Promise<Diary> {
    return await this.diaryService.updateDiary(id, diary);
  }

  @Post(':id')
  async saveDiary(@Body() diary: Diary): Promise<Diary> {
    const savedDiary = await this.diaryService.saveDiary(diary);

    return Object.assign({
      data: savedDiary,
      statusCode: 200,
      statusMsg: 'saved successfully',
    });
  }
}
