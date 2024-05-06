import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
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
  const microserviceAppRMQ =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.RMQ,
      logger: new Logger('Orders Microservice'),

      options: {
        urls: [configService.getOrThrow<string>('RMQ_SERVERS')],
        queue: 'orders_queue',
        queueOptions: {
          durable: false,
        },
        noAck: false,
      },
    });
  setupMicroservice(microserviceAppRMQ);
  await microserviceAppRMQ.listen();
  logger.log(`Microservice with RMQ is running`);
}
bootstrap();
