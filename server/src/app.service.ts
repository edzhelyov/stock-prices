import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
   data = [
    { buy: 90, sell: 17 }, { buy: 95, sell: 66 }, { buy: 22, sell: 33 },
    { buy: 38, sell: 46 }, { buy: 17, sell: 62 }, { buy: 12, sell: 75 },
    { buy: 88, sell: 37 }, { buy: 20, sell: 54 }, { buy: 64, sell: 13 },
    { buy: 47, sell: 24 }, { buy: 50, sell: 44 }, { buy: 49, sell: 40 },
    { buy: 86, sell: 25 }, { buy: 90, sell: 24 }, { buy: 62, sell: 16 },
    { buy: 76, sell: 18 }, { buy: 16, sell: 21 }, { buy: 39, sell: 74 },
    { buy: 98, sell: 31 }, { buy: 84, sell: 39 }, { buy: 73, sell: 95 },
    { buy: 62, sell: 33 }, { buy: 16, sell: 33 }, { buy: 64, sell: 29 },
    { buy: 56, sell: 97 }, { buy: 68, sell: 78 }, { buy: 10, sell: 24 },
    { buy: 16, sell: 92 }, { buy: 17, sell: 52 }, { buy: 46, sell: 74 },
    { buy: 30, sell: 35 }, { buy: 13, sell: 18 }, { buy: 65, sell: 39 },
    { buy: 78, sell: 60 }, { buy: 90, sell: 27 }, { buy: 82, sell: 20 },
    { buy: 55, sell: 70 }, { buy: 99, sell: 23 }, { buy: 69, sell: 70 },
    { buy: 51, sell: 64 }, { buy: 89, sell: 50 }, { buy: 75, sell: 19 },
    { buy: 99, sell: 94 }, { buy: 69, sell: 77 }, { buy: 70, sell: 54 },
    { buy: 90, sell: 50 }, { buy: 91, sell: 53 }, { buy: 21, sell: 67 },
    { buy: 81, sell: 70 }, { buy: 64, sell: 27 }, { buy: 69, sell: 71 },
    { buy: 49, sell: 10 }, { buy: 15, sell: 28 }, { buy: 97, sell: 67 },
    { buy: 66, sell: 78 }, { buy: 37, sell: 95 }, { buy: 51, sell: 87 },
    { buy: 91, sell: 69 }, { buy: 66, sell: 35 }, { buy: 20, sell: 31 },
    { buy: 54, sell: 42 }
  ]
  beginTime = 1672531200;
  endTime = this.beginTime + this.data.length - 1;

  updateData(data: {buy: number, sell: number}[], begintTime: number): void {
    this.data = data;
    this.beginTime = begintTime;
    this.endTime = begintTime + data.length - 1;
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
      return { error: errors };
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

  private calculateMaxProfit(startTime: number, endTime: number): [boolean, number, number] {
    let maxProfit = 0;
    let minPrice = Infinity;
    let buyPosition = 0;
    let sellPosition: number | null = null;
    let currentBuyPosition = 0;

    for (let i = startTime - this.beginTime; i <= endTime - this.beginTime; i++) {
      const buyPrice = this.data[i].buy;
      const sellPrice = this.data[i].sell;

      const profit = sellPrice - minPrice;
      if (profit > maxProfit) {
        maxProfit = profit;
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
