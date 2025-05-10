/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import {
  invalidEmail,
  invalidLength,
  invalidString,
  noEmptyField,
} from '../../utils/DtoValidators';

export class SignInDto {
  @IsNotEmpty({ message: noEmptyField('email') })
  @IsEmail({}, { message: invalidEmail('email') })
  email: string;

  @IsNotEmpty({ message: noEmptyField('password') })
  @IsString({ message: invalidString('password') })
  @Length(8, 50, { message: invalidLength('password', 8, 50) })
  password: string;
}
