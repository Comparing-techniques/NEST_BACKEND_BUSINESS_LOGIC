/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PartialType } from '@nestjs/mapped-types';
import { CreateJointDto } from './create-joint.dto';
import { IsBoolean, IsString, Length, IsOptional } from 'class-validator';
import {
  invalidString,
  invalidLength,
  invalidBoolean,
} from 'src/utils/DtoValidators';

export class UpdateJointDto extends PartialType(CreateJointDto) {
  @IsOptional()
  @IsString({ message: invalidString('description') })
  @Length(2, 100, { message: invalidLength('jointName', 2, 100) })
  jointName: string;

  @IsOptional()
  @IsBoolean({ message: invalidBoolean('status') })
  status: boolean;
}
