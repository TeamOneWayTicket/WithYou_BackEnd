import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SharedModule } from './shared/shared.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { setupSwagger } from './util/swagger';
import rateLimit from 'express-rate-limit';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const whitelist = [
    'https://appleid.apple.com',
    'https://backend.with-you.io',
    'https://frontend.with-you.io',
    'http://localhost:3030',
    'https://with-you-front-end.vercel.app',
    'https://accounts.kakao.com',
    'https://localhost:3030',
  ];
  app.enableCors({
    //origin: '*',
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error(origin + 'is Not allowed by CORS'));
      }
    },
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10000, // limit each IP to 100 requests per windowMs
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const configService = app.select(SharedModule).get(ApiConfigService);
  const port = configService.appConfig.port;
  console.log('server run on port #', port);
  setupSwagger(app);
  await app.listen(port);
}
bootstrap();
