/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import {
  invalidString,
  invalidLength,
  invalidBoolean,
} from 'src/utils/DtoValidators';
import { CreateRecordingInstitutionDto } from './create-recording-institution.dto';

export class UpdateRecordingInstitutionDto extends PartialType(
  CreateRecordingInstitutionDto,
) {
  @IsOptional()
  @IsString({ message: invalidString('description') })
  @Length(2, 200, { message: invalidLength('description', 2, 200) })
  description: string;

  @IsOptional()
  @IsBoolean({ message: invalidBoolean('status') })
  status: boolean;
}
