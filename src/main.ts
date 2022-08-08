import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SharedModule } from './shared/shared.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { setupSwagger } from './utils/swagger';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const whitelist = [
    'https://withyou-be.mayleaf.dev',
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
        callback(new Error('Not allowed by CORS'));
      }
    },
  });
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  const configService = app.select(SharedModule).get(ApiConfigService);
  const port = configService.appConfig.port;
  console.log('server run on port #', port);
  setupSwagger(app);
  await app.listen(port);
}
bootstrap();
