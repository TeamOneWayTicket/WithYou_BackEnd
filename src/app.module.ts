import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './module/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { AppController } from './app.controller';
import { AuthModule } from './module/auth/auth.module';
import { DiaryModule } from './module/diary/diary.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { FirebaseCloudMessageModule } from './module/firebase-cloud-message/firebase-cloud-message.module';
import { FamilyModule } from './module/family/family.module';
import { AlbumModule } from './module/album/album.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.redisConfig,
      inject: [ApiConfigService],
    }),
    UserModule,
    AuthModule,
    DiaryModule,
    FirebaseCloudMessageModule,
    FamilyModule,
    AlbumModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
