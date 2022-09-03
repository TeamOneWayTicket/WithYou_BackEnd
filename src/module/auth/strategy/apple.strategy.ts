import { PassportStrategy } from '@nestjs/passport';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-apple';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ApiConfigService) {
    super({
      clientID: configService.appleConfig.clientID,
      keyID: configService.appleConfig.keyID,
      teamID: configService.appleConfig.teamID,
      callbackURL: configService.appleConfig.callbackURL,
      keyFilePath: configService.appleConfig.keyFilePath,
      scope: ['email', 'name'],
    });
  }
}
