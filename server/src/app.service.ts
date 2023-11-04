import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getMaxProfit(startTime: number, endTime: number): object {
    const data = {
      1672531200: 1,
      1672531260: 10
    }
    return {
      "buyTime": startTime,
      "buyPrice": data[startTime],
      "sellTime": endTime,
      "sellPrice": data[endTime]
    };
  }
}
