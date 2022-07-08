import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'userEmail',
    });
  }

  async validate(userEmail: string): Promise<any> {
    console.log('로컬 auth 전략', userEmail);
    const user = await this.authService.validateUser(userEmail);
    if (!user) {
      console.log('유저 없음');
      throw new UnauthorizedException();
    }
    return user;
  }
}
