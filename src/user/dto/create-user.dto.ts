import {
  IsEmail,
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  Length,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';
import {
  invalidString,
  invalidLength,
  noEmptyField,
} from '../../utils/DtoValidators';


export class CreateUserDto {
    @IsString({ message: invalidString('identificationNumber') })
    @IsNotEmpty({ message: noEmptyField('identificationNumber') })
    @Length(5, 20, { message: invalidLength('identificationNumber', 5, 20) })
    identificationNumber: string;

    @IsString({ message: invalidString('name') })
    @IsNotEmpty({ message: noEmptyField('name') })
    @Length(2, 20, { message: invalidLength('name', 2, 20) })
    name: string;

    @IsString({ message: invalidString('lastName') })
    @IsNotEmpty({ message: noEmptyField('lastName') })
    @Length(2, 20, { message: invalidLength('lastName', 2, 20) })
    lastName: string;

    @IsEmail({}, { message: 'El email no es válido' })
    @IsNotEmpty({ message: noEmptyField('email') })
    email: string;

    @IsString({ message: invalidString('password') })
    @IsNotEmpty({ message: noEmptyField('password') })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    @MaxLength(250, {
        message: 'La contraseña no debe exceder los 250 caracteres',
    })
    password: string;

    @IsBoolean({ message: 'El valor de superusuario debe ser booleano' })
    @IsOptional()
    superuser?: boolean;

    @IsNumber({}, { message: 'El ID de posición debe ser un número' })
    @IsNotEmpty({ message: noEmptyField('posición') })
    positionId: number;
}