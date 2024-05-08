import { Controller, Get } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from 'src/rmq/rmq.service';
import { AppService } from './app.service';
@Controller('orders')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly rmqService: RmqService,
  ) {}

  @Get()
  public healthCheck() {
    return this.appService.getAPIData();
  }

  @EventPattern('test')
  replaceEmoji(@Payload() data: string, @Ctx() context: RmqContext) {
    console.log('Received data:', data);
    this.rmqService.ack(context);
  }
}
