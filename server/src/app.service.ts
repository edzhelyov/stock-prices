import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getMaxProfit(startTime: number, endTime: number): object {
    const data = {
      1672531200: 1,
      1672531260: 10
    }
    const errors = [];

    // TODO: Figure out how to properly validate in the context of NestJS
    if (startTime < 1672531200) {
      errors.push(`startTime should not be lower than 1672531200`);
    }
    if (endTime > 1672531260) {
      errors.push(`endTime should not be greater than 1672531260`);
    }
    if (errors.length > 0) {
      return { error: errors };
    }

    return {
      "buyTime": startTime,
      "buyPrice": data[startTime],
      "sellTime": endTime,
      "sellPrice": data[endTime]
    };
  }
}
