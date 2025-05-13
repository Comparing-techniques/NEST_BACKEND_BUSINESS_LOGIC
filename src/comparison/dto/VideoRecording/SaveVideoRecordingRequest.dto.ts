import { IsDefined, IsString } from 'class-validator';
import { invalidString, noEmptyField } from 'src/utils/DtoValidators';

export class SaveVideoRecordingRequestDto {
  @IsDefined({ message: noEmptyField('fileName en VideoRecording') })
  @IsString({ message: invalidString('fileName en VideoRecording') })
  fileName: string;

  @IsDefined({ message: noEmptyField('videoFile') })
  videoFile: Express.Multer.File;
}
