import { Controller, Get, Inject } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { AppService } from './app.service';
import { RMQ_SERVICE } from './constants';
@Controller('products')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(RMQ_SERVICE) private readonly client: ClientRMQ,
  ) {}

  @Get()
  public async healthCheck() {
    const message = 'Hola Mundo!';
    await this.client.connect();
    this.client.emit('test', message);

    return this.appService.getAPIData();
  }
}
