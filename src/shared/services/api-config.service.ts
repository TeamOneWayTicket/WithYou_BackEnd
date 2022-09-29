import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isNil } from 'lodash';

import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  // noinspection JSUnusedGlobalSymbols
  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  // noinspection JSUnusedGlobalSymbols
  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  // noinspection JSUnusedGlobalSymbols
  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  // noinspection JSUnusedGlobalSymbols
  get fallbackLanguage(): string {
    return this.getString('FALLBACK_LANGUAGE');
  }

  get redisConfig(): RedisModuleOptions {
    return {
      config: {
        host: this.getString('REDIS_HOST'),
        port: this.getNumber('REDIS_PORT'),
      },
    };
  }

  get postgresConfig(): TypeOrmModuleOptions {
    const entities = [
      __dirname + '/../../**/*.entity{.ts,.js}',
      __dirname + '/../../**/*.view-entity{.ts,.js}',
    ];
    const migrations = [__dirname + '/../../database/migrations/*{.ts,.js}'];

    return {
      entities,
      migrations,
      type: 'postgres',
      name: 'default',
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      migrationsRun: false,
      synchronize: true,
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  get awsConfig() {
    return {
      accessKey: this.getString('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.getString('AWS_SECRET_ACCESS_KEY'),
      bucketRegion: this.getString('AWS_S3_BUCKET_REGION'),
      bucketApiVersion: this.getString('AWS_S3_API_VERSION'),
      bucketName: this.getString('AWS_S3_BUCKET_NAME'),
    };
  }

  // noinspection JSUnusedGlobalSymbols
  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }

  // noinspection JSUnusedGlobalSymbols
  get natsEnabled(): boolean {
    return this.getBoolean('NATS_ENABLED');
  }

  // noinspection JSUnusedGlobalSymbols
  get natsConfig() {
    return {
      host: this.getString('NATS_HOST'),
      port: this.getNumber('NATS_PORT'),
    };
  }

  get authConfig() {
    return {
      privateKey: this.getString('JWT_PRIVATE_KEY'),
      publicKey: this.getString('JWT_PUBLIC_KEY'),
      secretkey: this.getString('JWT_SECRET_KEY'),
      jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
    };
  }

  get googleConfig() {
    return {
      restApiKey: this.getString('GOOGLE_OAUTH_API_KEY'),
      restApiPassword: this.getString('GOOGLE_OAUTH_PASSWORD'),
      callBackUrl: this.getString('GOOGLE_CALLBACK_URL'),
    };
  }

  get appleConfig() {
    return {
      clientID: this.getString('APPLE_REST_API_KEY'),
      callbackURL: this.getString('APPLE_LOGIN_REDIRECT_URL'),
      keyID: this.getString('APPLE_KEY_ID'),
      teamID: this.getString('APPLE_TEAM_ID'),
      keyFilePath: this.getString('APPLE_KEYFILE_PATH'),
    };
  }

  get kakaoConfig() {
    return {
      restApiKey: this.getString('KAKAO_REST_API_KEY'),
      loginRedirectUrl: this.getString('KAKAO_LOGIN_REDIRECT_URL'),
      logoutRedirectUrl: this.getString('KAKAO_LOGOUT_REDIRECT_URL'),
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    };
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }
}
