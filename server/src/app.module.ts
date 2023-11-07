import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StaticData } from './static-data';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    { provide: AppService, useValue: new AppService(StaticData.data, StaticData.beginTime) },
  ],
})
export class AppModule {}
