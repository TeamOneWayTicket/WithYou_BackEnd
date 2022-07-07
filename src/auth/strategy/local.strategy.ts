import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(userId: string, userPassword: string): Promise<any> {
    console.log('로컬 auth 전략', userId);
    const user = await this.authService.validateUser(userId, userPassword);
    if (!user) {
      throw new UnauthorizedException();
    }
  }
}
