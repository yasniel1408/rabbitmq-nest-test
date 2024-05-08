import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { RmqService } from './rmq/rmq.service';
import { setupApp } from './setup-app';

async function bootstrap() {
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  setupApp(app);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('RMQ_SERVICE'));
  await app.listen(configService.getOrThrow<number>('PORT'));
  app.startAllMicroservices();
}
bootstrap();
