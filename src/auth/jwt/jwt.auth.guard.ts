import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { JwtTokenResponse } from '../auth.DTO/jwtTokenResponse';
import { AuthService } from '../auth.service';

@Injectable()
export default class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ApiConfigService,
    private readonly authService: AuthService,
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
    request.user = this.validateToken(token);

    const user = await this.authService.findUser(request.user);
    if (!user) {
      throw new HttpException('유효하지 않은 유저입니다.', 401);
    }
    return user;
    return true;
  }

  validateToken(token: string) {
    const secretKey = this.configService.authConfig.secretkey;

    try {
      console.log(token);
      const verify = this.jwtService.verify(token, {
        secret: secretKey,
      }) as JwtTokenResponse;
      console.log(verify);
      return verify;
    } catch (e) {
      console.log(e.message);
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
