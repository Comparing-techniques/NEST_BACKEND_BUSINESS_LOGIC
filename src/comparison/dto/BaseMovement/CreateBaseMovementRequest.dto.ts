import { IsDefined, IsString, Matches } from 'class-validator';
import {
  invalidInt,
  invalidString,
  noEmptyField,
} from 'src/utils/DtoValidators';

export class CreateBaseMovementRequestDto {
  @IsDefined({ message: noEmptyField('userId en CreateBaseMovementRequest') })
  @IsString({ message: invalidString('userId en CreateBaseMovementRequest') })
  @Matches(/^[1-9]\d*$/, {
    message: invalidInt('userId en CreateBaseMovementRequest'),
  })
  userId: string;

  @IsDefined({
    message: noEmptyField('initialJointId en CreateBaseMovementRequest'),
  })
  @IsString({
    message: invalidString('initialJointId en CreateBaseMovementRequest'),
  })
  @Matches(/^[1-9]\d*$/, {
    message: invalidInt('initialJointId en CreateBaseMovementRequest'),
  })
  initialJointId: string;

  @IsDefined({
    message: noEmptyField(
      'recordingInstitutionId en CreateBaseMovementRequest',
    ),
  })
  @IsString({
    message: invalidString(
      'recordingInstitutionId en CreateBaseMovementRequest',
    ),
  })
  @Matches(/^[1-9]\d*$/, {
    message: invalidInt('recordingInstitutionId en CreateBaseMovementRequest'),
  })
  recordingInstitutionId: string;

  @IsDefined({
    message: noEmptyField('excelFile en CreateBaseMovementRequest'),
  })
  excelFile: Express.Multer.File;

  @IsDefined({
    message: noEmptyField('videoRecordingFile en CreateBaseMovementRequest'),
  })
  videoRecordingFile: Express.Multer.File;
}