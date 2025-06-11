/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PartialType } from '@nestjs/mapped-types';
import { CreatePositionDto } from './create-position.dto';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import {
  invalidString,
  invalidLength,
  invalidBoolean,
} from 'src/utils/DtoValidators';

export class UpdatePositionDto extends PartialType(CreatePositionDto) {
  
  @IsOptional()
  @IsString({ message: invalidString('description') })
  @Length(2, 30, { message: invalidLength('description', 2, 30) })
  description: string;

  @IsOptional()
  @IsBoolean({ message: invalidBoolean('status') })
  status: boolean;
}
