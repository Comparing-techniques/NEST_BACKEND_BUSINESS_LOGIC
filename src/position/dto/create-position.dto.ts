/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsNotEmpty, Length } from 'class-validator';

import {
  invalidString,
  noEmptyField,
  invalidLength,
} from '../../utils/DtoValidators';

export class CreatePositionDto {
  @IsNotEmpty({ message: noEmptyField('description') })
  @IsString({ message: invalidString('description') })
  @Length(2, 30, { message: invalidLength('description', 2, 30) })
  description: string;
}
