import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RMQ_SERVICE } from '../rmq/constants';
import { AppService } from './app.service';
@Controller('products')
export class AppController {
  private count = 0;

  constructor(
    private readonly appService: AppService,
    @Inject(RMQ_SERVICE) private client: ClientProxy,
  ) {}

  @Get()
  public async healthCheck() {
    const message = 'Hola Mundo! ';

    this.client.emit('test', message + this.count);

    this.count = this.count + 1;

    return this.appService.getAPIData();
  }
}
