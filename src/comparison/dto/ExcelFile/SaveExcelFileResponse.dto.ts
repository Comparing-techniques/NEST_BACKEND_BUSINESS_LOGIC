import { RecordingInstitutionResponseDto } from 'src/recording-institution/dto/RecordingInstitutionResponse.dto';

export class SaveExcelFileResponseDto {
  id: number;
  filename: string;
  recordingInstitution: RecordingInstitutionResponseDto;
  status: boolean;
}
