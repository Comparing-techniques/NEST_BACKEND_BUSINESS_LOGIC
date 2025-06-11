import {
  IsEmail,
  IsString,
  IsBoolean,
  IsOptional,
  Length,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';
import {
  invalidString,
  invalidLength,
} from '../../utils/DtoValidators';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';


export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsString({ message: invalidString('name') })
    @IsOptional()
    @Length(2, 20, { message: invalidLength('name', 2, 20) })
    name?: string;

    @IsString({ message: invalidString('lastName') })
    @IsOptional()
    @Length(2, 20, { message: invalidLength('lastName', 2, 20) })
    lastName?: string;

    @IsBoolean({ message: 'El valor de superusuario debe ser booleano' })
    @IsOptional()
    superuser?: boolean;

    @IsBoolean({ message: 'El estado debe ser booleano' })
    @IsOptional()
    status?: boolean;

    @IsNumber({}, { message: 'El ID de posición debe ser un número' })
    @IsOptional()
    positionId?: number;
}