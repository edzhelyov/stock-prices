import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class TimeParams {
    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    startTime: number;

    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    endTime: number;
}