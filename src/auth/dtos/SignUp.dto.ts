/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Length,
  Matches,
  IsInt,
} from 'class-validator';
import {
  invalidString,
  noEmptyField,
  invalidLength,
  invalidEmail,
  invalidInt,
  PASSWORD_INVALID_REGEX,
} from '../../utils/DtoValidators';
import { Type } from 'class-transformer';

export class SignUpDto {
  @IsNotEmpty({ message: noEmptyField('identificationNumber') })
  @IsString({ message: invalidString('identificationNumber') })
  @Length(8, 20, { message: invalidLength('identificationNumber', 8, 20) })
  identificationNumber: string;

  @IsNotEmpty({ message: noEmptyField('name') })
  @IsString({ message: invalidString('name') })
  @Length(8, 20, { message: invalidLength('name', 2, 20) })
  name: string;

  @IsNotEmpty({ message: noEmptyField('lastName') })
  @IsString({ message: invalidString('lastName') })
  @Length(2, 20, { message: invalidLength('lastName', 2, 20) })
  lastName: string;

  @IsNotEmpty({ message: noEmptyField('email') })
  @IsEmail({}, { message: invalidEmail('email') })
  email: string;

  @IsString()
  @IsNotEmpty({ message: noEmptyField('password') })
  @Length(8, 50, { message: invalidLength('password', 8, 20) })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: PASSWORD_INVALID_REGEX,
  })
  password: string;

  @IsNotEmpty({ message: noEmptyField('positionId') })
  @Type(() => Number)
  @IsInt({ message: invalidInt('positionId') })
  positionId: number;
}
