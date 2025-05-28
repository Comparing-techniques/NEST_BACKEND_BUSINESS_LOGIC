import { IsDefined, IsString, Matches, IsBoolean } from 'class-validator';
import {
  noEmptyField,
  invalidString,
  invalidInt,
} from 'src/utils/DtoValidators';

export class ComparativeMovementRequestDto {
  
  @IsDefined({ message: noEmptyField('excelFileId en CreateComparativeMovementRequest') })
  @IsString({ message: invalidString('excelFileId en CreateComparativeMovementRequest') })
  @Matches(/^[1-9]\d*$/, {
    message: invalidInt('excelFileId en CreateComparativeMovementRequest'),
  })
  excelFileId: string | number;

  @IsDefined({ message: noEmptyField('status en CreateComparativeMovementRequest') })
  @IsBoolean({ message: 'El campo status debe ser un valor booleano válido.' })
  status: boolean;
}