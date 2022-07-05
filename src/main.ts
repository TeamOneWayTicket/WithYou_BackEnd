import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
declare const module: any;
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { ApiConfigService } from './shared/services/api-config.service';
//import { TranslationService } from './shared/services/translation.service';
import { SharedModule } from './shared/shared.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  // app.setGlobalPrefix('/api'); use api as global prefix if you don't have subdomain
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  const configService = app.select(SharedModule).get(ApiConfigService);

  const port = configService.appConfig.port;
  await app.listen(port);

  console.info(`server running on ${await app.getUrl()}`);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
