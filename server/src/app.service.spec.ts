import { AppService } from './app.service';

describe('AppService', () => {
  describe('getMaxProfit', () => {
    it('returns the correct buy and sell when min buy is on the left of max sell', () => {
      const service = new AppService([
          { buy: 15, sell: 20 },
          { buy: 10, sell: 25 },
          { buy: 20, sell: 30 },
          { buy: 18, sell: 22 },
          { buy: 25, sell: 40 },
          { buy: 30, sell: 35 },
        ],
        0
      );

      const result = service.getMaxProfit(0, 5);

      expect(result['buyTime']).toEqual(1);
      expect(result['sellTime']).toEqual(4);
    });

    it('returns the buy and sell that will yield the most profit when the min buy is on the right of max sell', () => {
      const service = new AppService([
          { buy: 12, sell: 20 },
          { buy: 20, sell: 113 },
          { buy: 10, sell: 30 },
          { buy: 18, sell: 95 },
          { buy: 25, sell: 40 },
          { buy: 30, sell: 35 },
        ],
        0
      );

      const result = service.getMaxProfit(0, 5);

      expect(result['buyTime']).toEqual(2);
      expect(result['sellTime']).toEqual(3);
    });

    it('returns the max profit when the next buy/sell price is big enough to outperform the min buy price', () => {
      const service = new AppService([
          { buy: 12, sell: 20 },
          { buy: 20, sell: 115 },
          { buy: 10, sell: 30 },
          { buy: 18, sell: 95 },
          { buy: 25, sell: 40 },
          { buy: 30, sell: 35 },
        ],
        0
      );

      const result = service.getMaxProfit(0, 5);

      expect(result['buyTime']).toEqual(0);
      expect(result['sellTime']).toEqual(1);
    });

    it('returns the earliest and shortest time when there are multiple solutions', () => {
      const service = new AppService([
          { buy: 12, sell: 20 },
          { buy: 10, sell: 114 },
          { buy: 10, sell: 20 },
          { buy: 18, sell: 95 },
          { buy: 10, sell: 15 },
          { buy: 30, sell: 20 },
        ],
        0
      );

      const result = service.getMaxProfit(0, 5);

      expect(result['buyTime']).toEqual(0);
      expect(result['sellTime']).toEqual(1);
    });

    it('returns the correct buy and sell for the specified period only', () => {
      const service = new AppService([
        { buy: 10, sell: 20 },
          { buy: 20, sell: 15 },
          { buy: 30, sell: 20 },
          { buy: 40, sell: 30 },
          { buy: 10, sell: 15 },
          { buy: 30, sell: 50 },
        ],
        0
      );

      const result = service.getMaxProfit(1, 4);

      expect(result['buyTime']).toEqual(1);
      expect(result['sellTime']).toEqual(3);
    });

    it('does not consider buy and sell at the same time', () => {
      const service = new AppService([
          { buy: 10, sell: 15 },
          { buy: 8, sell: 13 },
        ],
        0
      );

      const result = service.getMaxProfit(0, 1);

      expect(result['buyTime']).toEqual(0);
      expect(result['sellTime']).toEqual(1);
    });

    it('returns do not buy when there is no profit possible', () => {
      const service = new AppService([
          { buy: 10, sell: 20 },
          { buy: 10, sell: 5 },
        ],
        0
      );

      const result = service.getMaxProfit(0, 1);

      expect(result['shouldBuy']).toEqual(false);
      expect(result['buyTime']).toEqual(0);
      expect(result['sellTime']).toEqual(0);
    });

    it('returns error if startTime is before than the beginning of the data period', () => {
      const service = new AppService([
          { buy: 10, sell: 20 },
          { buy: 10, sell: 5 },
        ],
        10
      );

      const result = service.getMaxProfit(0, 1);

      expect(result['errors']).toContain('startTime should not be lower than 10');
    });

    it('returns error if endTime is after than the end of the data period', () => {
      const service = new AppService([
          { buy: 10, sell: 20 },
          { buy: 10, sell: 5 },
        ],
        10
      );

      const result = service.getMaxProfit(10, 12);

      expect(result['errors']).toContain('endTime should not be greater than 11');
    });

    it('returns error if startTime is after endTime', () => {
      const service = new AppService([], 0);
      const result = service.getMaxProfit(2, 1);

      expect(result['errors']).toContain('startTime should be before endTime');
    });
  });
});