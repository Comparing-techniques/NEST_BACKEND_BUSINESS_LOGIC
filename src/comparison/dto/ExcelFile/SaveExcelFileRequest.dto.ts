import { IsDefined, IsString } from 'class-validator';
import { noEmptyField, invalidString } from 'src/utils/DtoValidators';

export class SaveExcelFileRequestDto {
  @IsDefined({ message: noEmptyField('fileName en ExcelFile') })
  @IsString({ message: invalidString('fileName en ExcelFile') })
  fileName: string;

  @IsDefined({ message: noEmptyField('file en ExcelFile') })
  file: Express.Multer.File;
}
