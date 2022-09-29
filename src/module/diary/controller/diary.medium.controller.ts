import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { DiaryService } from '../service/diary.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PutSignedUrlsResponseDto } from '../dto/put-signed-urls-response.dto';
import { GetPresignedUrlsResponseDto } from '../dto/get-presigned-urls-response.dto';
import { CreateMediaResponseDto } from '../dto/create-media-response.dto';
import { Auth } from '../../../decorator/http.decorator';
import { Role } from '../../../common/enum/role.enum';
import { PutPresignedUrlsDto } from '../dto/put-presigned-urls.dto';
import { GetPresignedUrlsDto } from '../dto/get-presigned-urls.dto';
import { DiaryMediumService } from '../service/diary.medium.service';

@Controller('diary')
@ApiTags('일기장 Medium API')
export class DiaryMediumController {
  constructor(
    private readonly diaryService: DiaryService,
    private readonly diaryMediumService: DiaryMediumService,
  ) {}

  @Post('/presigned-upload')
  @Auth(Role.User)
  @ApiBody({ type: PutPresignedUrlsDto })
  @ApiOkResponse({ description: '성공', type: PutSignedUrlsResponseDto })
  @ApiOperation({
    summary: 's3 업로드용 preSigned URL 발급 api',
    description: 's3에 medium Put할 수 있는 preSigned URL들 발급 api.',
  })
  async getSignedUrlsForPutObject(
    @Body() dto: PutPresignedUrlsDto,
  ): Promise<PutSignedUrlsResponseDto> {
    return await this.diaryMediumService.getSignedUrlsForPutObject(dto);
  }

  @Get('/presigned-download')
  @Auth(Role.User)
  @ApiOkResponse({ description: '성공', type: GetPresignedUrlsResponseDto })
  @ApiOperation({
    summary: 's3 다운로드용 preSigned URL 발급 api',
    description: 's3에서 특정 객체 Get할 수 있는 preSigned URL들 발급 api.',
  })
  async getSignedUrlsForGetObject(
    @Body() dto: GetPresignedUrlsDto,
  ): Promise<GetPresignedUrlsResponseDto> {
    return await this.diaryMediumService.getSignedUrlsForGetObject(
      dto.fileNamesInS3,
    );
  }

  @Get('/:diaryId/presigned-downlad')
  @Auth(Role.User)
  @ApiOkResponse({ description: '성공', type: GetPresignedUrlsResponseDto })
  @ApiOperation({
    summary: '특정 일기 medium 의 다운로드용 preSigned URL 들 가져오는 api',
    description: '특정 일기 medium 의 다운로드용 preSigned URL 들 가져오는 api',
  })
  async getDiarySignedUrls(
    @Param('diaryId', ParseIntPipe) diaryId: number,
  ): Promise<GetPresignedUrlsResponseDto> {
    return await this.diaryMediumService.getDiaryMediaUrls(diaryId);
  }

  @Post('/:diaryId/upload-mediums')
  @Auth(Role.User)
  @ApiOkResponse({ description: '성공', type: CreateMediaResponseDto })
  @ApiOperation({
    summary: '클라이언트 측의 업로드 완료 request 처리',
    description: '업로드한 medium 객체 생성 및 저장 api.',
  })
  async createMedium(
    @Param('diaryId', ParseIntPipe) diaryId: number,
    @Query('fileNamesInS3') fileNamesInS3: string[],
  ): Promise<CreateMediaResponseDto> {
    return await this.diaryMediumService.createDiaryMedia(
      diaryId,
      fileNamesInS3,
    );
  }
}
