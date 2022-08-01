import { PassportStrategy } from '@nestjs/passport';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { Injectable } from '@nestjs/common';
import { Strategy, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ApiConfigService) {
    super({
      clientID: configService.googleConfig.restApiKey,
      clientSecret: configService.googleConfig.restApiPassword,
      callbackURL: configService.googleConfig.callBackUrl,
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, name, emails } = profile;

    return {
      googleId: id,
      nickname: name.givenName,
      email: emails[0].value,
    };
  }
}
