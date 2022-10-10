import { Controller, Get } from '@nestjs/common';
import { Auth } from '../decorator/http.decorator';
import { Role } from '../common/enum/role.enum';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { DiariesResponseDto } from '../module/diary/dto/diaries-response.dto';
import { UserParam } from '../decorator/user.decorator';
import { User } from '../module/user/entity/user.entity';
import { AlbumService } from './album.service';
import { MediaDto } from './dto/media.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}
  @Get('family')
  @Auth(Role.User)
  @ApiOkResponse({ description: '성공', type: DiariesResponseDto })
  @ApiOperation({
    summary: 'get family photos',
    description: '유저를 포함한 유저 가족의 사진 받아온다.',
  })
  async getFamilyPhotos(@UserParam() user: User): Promise<MediaDto> {
    return await this.albumService.getFamilyPhotos(user.familyId);
  }
}
