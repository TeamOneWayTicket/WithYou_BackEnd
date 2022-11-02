import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtValidationDto } from '../dto/jwt-validation.dto';
import { User } from '../../user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LocalUserDto } from '../../user/dto/local.user.dto';
import { LocalAuthService } from '../service/local.auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalUser } from '../../user/entity/local.user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Controller('auth/local')
@ApiTags('인증 API')
export class LocalAuthController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(LocalUser)
    private readonly localUserRepository: Repository<LocalUser>,
    private readonly localAuthService: LocalAuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/register')
  @ApiOkResponse({ description: '성공', type: User })
  @ApiOperation({
    summary: 'local register',
  })
  async register(@Body() dto: LocalUserDto, @Res() res): Promise<void> {
    const user = await this.localAuthService.register(dto);
    const token = this.jwtService.sign({
      id: user.userId,
      vendor: 'local',
      nickname: '',
      thumbnail: '',
      isNew: true,
    });
    res.cookie('jwt', token, {
      domain: '.with-you.io',
      httpOnly: false,
      sameSite: 'strict',
      secure: true,
    });
  }

  @Post('/login')
  @ApiOkResponse({ description: '성공', type: JwtValidationDto })
  @ApiOperation({
    summary: 'local login',
  })
  async login(@Body() dto: LocalUserDto, @Res() res): Promise<void> {
    const localUser = await this.localUserRepository.findOne({
      where: { email: dto.email },
    });
    if (!localUser) {
      throw new BadRequestException('일치하는 유저가 없습니다');
    }

    const isValid = await bcrypt.compare(
      this.localAuthService.createHashedPassword(dto.password),
      localUser.password,
    );
    if (!isValid) {
      throw new BadRequestException('비밀번호가 틀렸습니다');
    }
    const user = await this.userRepository.findOne({
      where: { id: localUser.userId },
    });
    const token = this.jwtService.sign({
      id: user.id,
      vendor: 'local',
      nickname: user.nickname,
      thumbnail: user.nickname,
    });
    res.cookie('jwt', token, {
      domain: '.with-you.io',
      httpOnly: false,
      sameSite: 'strict',
      secure: true,
    });
  }
}
