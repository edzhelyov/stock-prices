import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe(('/'), () => {
    it('returns proper calculation', () => {
      const startTime = 1672531200;
      const endTime = 1672531260;

      const data = {
        1672531200: 1,
        1672531260: 10
      }
      const expectedResponse = {
        "buyTime": startTime,
        "buyPrice": data[startTime],
        "sellTime": endTime,
        "sellPrice": data[endTime]
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

    it('returns 400 when startTime or endTime is not a number', () => {
      return request(app.getHttpServer())
      .get(`/?startTime=abc&endTime=def`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toContain('startTime must be a number conforming to the specified constraints');
        expect(response.body.message).toContain('endTime must be a number conforming to the specified constraints');
      });
    });
  });
});
