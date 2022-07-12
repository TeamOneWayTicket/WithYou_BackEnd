import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'id',
      passwordField: 'familyId',
    });
  }

  async validate(userId: number, familyId: number): Promise<any> {
    console.log('로컬 auth 전략', userId);
    const user = await this.authService.validateUser(userId);
    if (!user) {
      console.log('유저 없음');
      throw new UnauthorizedException();
    }
    return user;
  }
}
