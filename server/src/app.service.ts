import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  data: {buy: number, sell: number}[];
  beginTime: number;
  endTime: number;

  constructor(data: {buy: number, sell: number}[], beginTime: number) {
    this.data = data;
    this.beginTime = beginTime;
    this.endTime = beginTime + data.length - 1;
  }

  getBuyPrice(time: number): number {
    return this.data[time - this.beginTime]['buy'];
  }

  getSellPrice(time: number): number {
    return this.data[time - this.beginTime]['sell'];
  }

  getMaxProfit(startTime: number, endTime: number): object {
    const errors = [];

    // TODO: Figure out how to properly validate in the context of NestJS
    if (startTime < this.beginTime) {
      errors.push(`startTime should not be lower than ${this.beginTime}`);
    }
    if (endTime > this.endTime) {
      errors.push(`endTime should not be greater than ${this.endTime}`);
    }
    if (startTime >= endTime) {
      errors.push('startTime should be before endTime');
    }
    if (errors.length > 0) {
      return { errors: errors };
    }

    const [shouldBuy, buyTime, sellTime] = this.calculateMaxProfit(startTime, endTime);

    if (shouldBuy) {
      return {
        shouldBuy: true,
        buyTime: buyTime,
        buyPrice: this.getBuyPrice(buyTime),
        sellTime: sellTime,
        sellPrice: this.getSellPrice(sellTime)
      };
    } else {
      return {
        shouldBuy: false,
        buyTime: 0,
        buyPrice: 0,
        sellTime: 0,
        sellPrice: 0
      };
    }

  }

  // To find the max profit we need to find the combination of buy and sell prices that generate the max ROI
  // where ROI = (investement / buy price) * sell price / investement; or ROI = sell price / buy price
  private calculateMaxProfit(startTime: number, endTime: number): [boolean, number, number] {
    let maxROI = 1;
    let minPrice = Infinity;
    let buyPosition = 0;
    let sellPosition: number | null = null;
    let currentBuyPosition = 0;

    for (let i = startTime - this.beginTime; i <= endTime - this.beginTime; i++) {
      const buyPrice = this.data[i].buy;
      const sellPrice = this.data[i].sell;

      const roi = sellPrice / minPrice;
      if (roi > maxROI) {
        maxROI = roi;
        buyPosition = currentBuyPosition;
        sellPosition = i;
      }

      if (buyPrice < minPrice) {
        minPrice = buyPrice;
        currentBuyPosition = i;
      }
    }

    if (sellPosition !== null) {
      return [true, this.beginTime + buyPosition, this.beginTime + sellPosition]
    } else {
      return [false, 0, 0]
    }
  }
}
