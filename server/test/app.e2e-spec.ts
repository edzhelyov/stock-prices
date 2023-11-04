import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AppService } from './../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let service: AppService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    service = moduleFixture.get<AppService>(AppService);
    service.updateData([{buy: 1, sell: 2}, {buy: 2, sell: 10}], 1672531200)
  });

  describe(('/'), () => {
    const startTime = 1672531200;
    const endTime = 1672531201;

    it('returns proper calculation', () => {
      const expectedResponse = {
        "buyTime": startTime,
        "buyPrice": 1,
        "sellTime": endTime,
        "sellPrice": 10
      };

      return request(app.getHttpServer())
        .get(`/?startTime=${startTime}&endTime=${endTime}`)
        .expect(200)
        .expect(expectedResponse);
    });

    it('returns 400 when startTime or endTime is missing', () => {
      return request(app.getHttpServer())
      .get(`/`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toContain('startTime should not be empty');
        expect(response.body.message).toContain('endTime should not be empty');
      });
    });

    xit('returns 400 when startTime or endTime is empty', () => {
      return request(app.getHttpServer())
      .get(`/?startTime=&endTime=`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toContain('startTime should not be empty');
        expect(response.body.message).toContain('endTime should not be empty');
      });
    });

    it('returns 400 when startTime or endTime is not a number', () => {
      return request(app.getHttpServer())
      .get(`/?startTime=abc&endTime=def`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toContain('startTime must be a number conforming to the specified constraints');
        expect(response.body.message).toContain('endTime must be a number conforming to the specified constraints');
      });
    });

    it('returns 400 when startTime is before than the earliest data point', () => {
      return request(app.getHttpServer())
      .get(`/?startTime=${startTime - 1}&endTime=${endTime}`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toContain(`startTime should not be lower than ${startTime}`);
      });
    });

    it('returns 400 when endTime is after the latest data point', () => {
      return request(app.getHttpServer())
      .get(`/?startTime=${startTime}&endTime=${endTime + 1}`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toContain(`endTime should not be greater than ${endTime}`);
      });
    });

    it('returns 400 when startTime is not before endTime', () => {
      return request(app.getHttpServer())
      .get(`/?startTime=${startTime}&endTime=${startTime}`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toContain(`startTime should be before endTime`);
      });
    });
  });
});
