import { ApiProperty } from '@nestjs/swagger';
import { Trim } from 'class-sanitizer';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @Trim()
  @IsEmail()
  public readonly email: string;

  @ApiProperty()
  @IsString()
  public readonly firstName: string;

  @ApiProperty()
  @IsString()
  public readonly lastName: string;

  @ApiProperty()
  @IsString()
  public readonly timezoneId: string;

  @ApiProperty()
  @IsString()
  public readonly birthdate: string;
}

export class RegisterRespDto {
  @ApiProperty()
  @IsString()
  public readonly test: string;
}

export class TimeZonePayload {
  @ApiProperty()
  @IsString()
  public value!: string;

  @ApiProperty()
  @IsString()
  public text!: string;

  @ApiProperty()
  @IsString({ each: true })
  public utc!: string[];

  @ApiProperty()
  @IsNumber()
  public offset!: number;
}

export class TimeZoneDto {
  @ApiProperty({ type: [TimeZonePayload] })
  @Type(() => TimeZonePayload)
  @ValidateNested({ each: true })
  public readonly timezone: Array<TimeZonePayload>;
}
