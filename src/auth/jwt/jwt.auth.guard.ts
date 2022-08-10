import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { JwtTokenResponseDto } from '../authDto/jwt-token-response.dto';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';

@Injectable()
export default class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ApiConfigService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    console.log('가드 시동');
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;

    if (authorization === undefined) {
      throw new HttpException('Token 전송 안됨', HttpStatus.UNAUTHORIZED);
    }

    const token = authorization.replace('Bearer ', '');
    const jwtToken = this.validateToken(token);
    const user = await this.userService.findOne(jwtToken.userId);
    if (!user) {
      throw new HttpException('유효하지 않은 유저입니다.', 401);
    }
    return user;
    return true;
  }

  validateToken(token: string) {
    const secretKey = this.configService.authConfig.secretkey;

    try {
      const verify = this.jwtService.verify(token, {
        secret: secretKey,
      }) as JwtTokenResponseDto;
      return verify;
    } catch (e) {
      switch (e.message) {
        // 토큰에 대한 오류를 판단합니다.
        case 'invalid token':
          throw new HttpException('유효하지 않은 토큰입니다.', 401);

        case 'jwt expired':
          throw new HttpException('토큰이 만료되었습니다.', 410);

        default:
          throw new HttpException('서버 오류입니다.', 500);
      }
    }
  }
}
