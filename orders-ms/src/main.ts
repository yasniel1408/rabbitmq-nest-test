import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { natsOptions } from './app/constants';
import { setupApp } from './setup-app';
import { setupMicroservice } from './setup-microservice';

async function bootstrap() {
  const logger = new Logger('Orders Microservice');

  // API
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  setupApp(app);
  await app.listen(configService.getOrThrow<number>('PORT'));

  // MICROSERVICE rabbitmq
  const microserviceAppNATS =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.NATS,
      options: {
        servers: [configService.getOrThrow<string>('NATS_SERVERS')],
        ...natsOptions,
      },
    });
  setupMicroservice(microserviceAppNATS);
  await microserviceAppNATS.listen();
  logger.log(`Microservice with NATS is running`);
}
bootstrap();
