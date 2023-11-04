import { Controller, Get, HttpException, HttpStatus, Query, UsePipes, ValidationPipe,  } from '@nestjs/common';
import { AppService } from './app.service';
import { TimeParams } from './time-params.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  getMaxProfit(@Query() timeParams: TimeParams): object {
    const result = this.appService.getMaxProfit(timeParams.startTime, timeParams.endTime);

    if ('errors' in result) {
      this.validationErrorResponse(result['errors'] as string[]);
    }
    
    return result;
  }

  private validationErrorResponse(errors: string[]): object {
    const response = {
      'message': errors,
      'error': 'Bad Request',
      'statusCode': 400
    }
    throw new HttpException(response, HttpStatus.BAD_REQUEST);
  }
}