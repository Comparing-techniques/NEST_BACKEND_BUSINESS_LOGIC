/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString, Length } from 'class-validator';
import {
  noEmptyField,
  invalidString,
  invalidLength,
} from 'src/utils/DtoValidators';

export class CreateJointDto {
  @IsNotEmpty({ message: noEmptyField('description') })
  @IsString({ message: invalidString('description') })
  @Length(2, 100, { message: invalidLength('jointName', 2, 100) })
  jointName: string;
}
