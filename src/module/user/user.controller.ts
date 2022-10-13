import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './service/user.service';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { DeleteUserResponseDto } from './dto/delete-user-response.dto';
import { Auth } from '../../decorator/http.decorator';
import { Role } from '../../common/enum/role.enum';
import { UserParam } from '../../decorator/user.decorator';
import { UserPushTokenDto } from './dto/user-push-token.dto';
import { FamilyResponseDto } from '../family/dto/family-response.dto';
import { ProfileDto } from './dto/profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { ProfileUploadResponseDto } from './dto/profileUpload-response.dto';
import { FamilyService } from '../family/family.service';

@Controller('user')
@ApiTags('유저 API')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly familyService: FamilyService,
  ) {}

  @Patch('/join/:code')
  @Auth(Role.User)
  @ApiOkResponse({ description: '성공', type: FamilyResponseDto })
  @ApiOperation({
    summary: 'get invite-code',
    description: '유저의 가족에 초대할 수 있는 초대 코드 발급',
  })
  async joinFamily(
    @UserParam() user: User,
    @Param('code') inviteCode: string,
  ): Promise<string> {
    if (!(await this.familyService.isValidCode(inviteCode))) {
      throw new BadRequestException('유효하지 않은 초대 코드 입니다');
    }
    await this.userService.joinFamily(user.id, inviteCode);
    return 'join success';
  }

  @Post('push-token')
  @Auth(Role.User)
  @ApiOperation({ description: '사용자의 FCM 푸시토큰을 저장하는 API' })
  async saveUserPushToken(
    @UserParam() user: User,
    @Body() dto: UserPushTokenDto,
  ) {
    return await this.userService.saveUserPushToken(user.id, dto.token);
  }

  @Get(':id')
  @Auth(Role.User)
  @ApiOkResponse({ description: '성공', type: UserResponseDto })
  @ApiOperation({
    summary: 'getUserById',
    description: '특정 id 유저 가지고 온다.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Get('/profile/upload-url')
  @Auth(Role.User)
  @ApiOperation({
    summary: '유저 프로필 올릴 url 받아옴',
  })
  async getProfileUploadUrl(
    @UserParam() user: User,
    @Query('contentType') contentType,
  ): Promise<ProfileUploadResponseDto> {
    return await this.userService.getUrlsForUpload(contentType);
  }

  @Get('/profile/download')
  @Auth(Role.User)
  @ApiOperation({
    summary: 'get profile',
    description: '유저 프로필 url 받아옴',
  })
  async getProfile(@UserParam() user: User): Promise<ProfileResponseDto> {
    return await this.userService.getProfileUrl(user.id);
  }

  @Post('/profile/upload')
  @Auth(Role.User)
  @ApiOperation({
    summary: '프로필 사진 정보 입력, 프로필 사진 다운로드 url 반환',
  })
  async postProfile(
    @UserParam() user: User,
    @Body() dto: ProfileDto,
  ): Promise<ProfileResponseDto> {
    if (!(await this.familyService.isValidCode(dto.code))) {
      throw new BadRequestException('유효하지 않은 초대 코드 입니다');
    }
    await this.userService.joinFamily(user.id, dto.code);
    return await this.userService.saveProfile(user.id, dto);
  }

  @Post()
  @ApiOkResponse({ description: '성공', type: UserResponseDto })
  @ApiOperation({
    summary: 'createUser',
    description: '유저 생성한다.',
  })
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'deleteUser',
    description: '유저 삭제한다.',
  })
  @ApiOkResponse({ description: '성공', type: DeleteUserResponseDto })
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteUserResponseDto> {
    return { affected: await this.userService.deleteUser(id) };
  }
}
