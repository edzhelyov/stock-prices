import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AppService } from './../src/app.service';
import { StaticData } from './../src/static-data';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let testService = new AppService([
      {buy: 2, sell: 5},
      {buy: 1, sell: 2},
      {buy: 3, sell: 4},
      {buy: 1, sell: 3}
    ],
    1672531200
  );

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(AppService)
    .useValue(testService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe(('/api/max-profit'), () => {
    const startTime = 1672531200;
    const endTime = 1672531203;

    it('returns proper calculation', () => {
      const expectedResponse = {
        "shouldBuy": true,
        "buyTime": 1672531201,
        "buyPrice": 1,
        "sellTime": 1672531202,
        "sellPrice": 4
      };

      return request(app.getHttpServer())
        .get(`/api/max-profit?startTime=${startTime}&endTime=${endTime}`)
        .expect(200)
        .expect(expectedResponse);
    });

    it('returns 400 when startTime or endTime is missing', () => {
      return request(app.getHttpServer())
      .get(`/api/max-profit`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toContain('startTime should not be empty');
        expect(response.body.message).toContain('endTime should not be empty');
      });
    });

    it('returns 400 when startTime or endTime is empty', () => {
      return request(app.getHttpServer())
      .get(`/api/max-profit?startTime=&endTime=`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toContain('startTime should not be empty');
        expect(response.body.message).toContain('endTime should not be empty');
      });
    });

    it('returns 400 when startTime or endTime is not a number', () => {
      return request(app.getHttpServer())
      .get(`/api/max-profit?startTime=abc&endTime=def`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toContain('startTime must be a number conforming to the specified constraints');
        expect(response.body.message).toContain('endTime must be a number conforming to the specified constraints');
      });
    });

    it('returns 400 when startTime is before than the earliest data point', () => {
      return request(app.getHttpServer())
      .get(`/api/max-profit?startTime=${startTime - 1}&endTime=${endTime}`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toContain(`startTime should not be lower than ${startTime}`);
      });
    });

    it('returns 400 when endTime is after the latest data point', () => {
      return request(app.getHttpServer())
      .get(`/api/max-profit?startTime=${startTime}&endTime=${endTime + 1}`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toContain(`endTime should not be greater than ${endTime}`);
      });
    });

    it('returns 400 when startTime is not before endTime', () => {
      return request(app.getHttpServer())
      .get(`/api/max-profit?startTime=${startTime}&endTime=${startTime}`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toContain(`startTime should be before endTime`);
      });
    });
  });
});
