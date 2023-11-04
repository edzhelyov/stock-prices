import { Controller, Get, Query, UsePipes, ValidationPipe,  } from '@nestjs/common';
import { AppService } from './app.service';
import { TimeParams } from './time-params.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  getMaxProfit(@Query() timeParams: TimeParams): object {
    return this.appService.getMaxProfit(timeParams.startTime, timeParams.endTime);
  }
}