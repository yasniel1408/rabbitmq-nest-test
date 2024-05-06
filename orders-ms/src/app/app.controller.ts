import { Controller, Get } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';
@Controller('orders')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public healthCheck() {
    return this.appService.getAPIData();
  }

  @EventPattern('test')
  replaceEmoji(@Payload() data: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    console.log('Received data:', data);
    channel.ack(originalMsg);
  }
}
