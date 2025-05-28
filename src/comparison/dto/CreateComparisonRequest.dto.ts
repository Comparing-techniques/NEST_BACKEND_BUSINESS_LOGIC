import { IsDefined, IsString, Matches } from 'class-validator';
import { invalidInt, invalidString, noEmptyField } from 'src/utils/DtoValidators';

export class CreateComparisonRequestDto {

  @IsDefined({ message: noEmptyField('userId en CreateComparison') })
  @IsString({ message: invalidString('userId en CreateComparison') })
  @Matches(/^[1-9]\d*$/, {
    message: invalidInt('userId en CreateComparison'),
  })
  userId: string;

  @IsDefined({
    message: noEmptyField(
      'recordingInstitutionId en CreateComparison',
    ),
  })
  @IsString({
    message: invalidString(
      'recordingInstitutionId en CreateComparison',
    ),
  })
  @Matches(/^[1-9]\d*$/, {
    message: invalidInt('recordingInstitutionId en CreateComparison'),
  })
  recordingInstitutionId: string;

  @IsDefined({ message: noEmptyField('baseExcelFileId en CreateComparison') })
  @IsString({ message: invalidString('baseExcelFileId en CreateComparison') })
  baseExcelFileId: string;
  
  @IsDefined({ 
    message: noEmptyField('excelFileCompare en CreateComparison') 
  })
  excelFileCompare: Express.Multer.File;

}