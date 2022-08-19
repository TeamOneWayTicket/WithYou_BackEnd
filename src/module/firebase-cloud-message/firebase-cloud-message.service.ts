import { Injectable } from '@nestjs/common';
import { messaging } from 'firebase-admin';
import { UserPushTokenService } from '../user/service/user-push-token.service';
import TokenMessage = messaging.TokenMessage;
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class FirebaseCloudMessageService {
  constructor(
    private readonly userPushTokenService: UserPushTokenService,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  private readonly PushQueue = 'fcm_push_queue';

  async send(userId: number, message: TokenMessage) {
    try {
      const userPushToken =
        await this.userPushTokenService.findPushTokenByUserId(userId);
      await this.redis.rpush(
        this.PushQueue,
        JSON.stringify({
          ...message,
          token: userPushToken.firebaseToken,
        }),
      );
    } catch (e) {
      console.log(e);
    }
  }
}
