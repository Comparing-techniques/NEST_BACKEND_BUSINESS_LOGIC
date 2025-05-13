import { IsDefined, IsString } from 'class-validator';
import { invalidString, noEmptyField } from 'src/utils/DtoValidators';

export class CreateComparisonDto {
  @IsDefined({ message: noEmptyField('base_excel_file') })
  base_excel_file: Express.Multer.File;

  @IsDefined({ message: noEmptyField('excel_file_compare') })
  excel_file_compare: Express.Multer.File;

  @IsDefined({ message: noEmptyField('joint_id') })
  @IsString({ message: invalidString('joint_id') })
  joint_id: number | string;
}
