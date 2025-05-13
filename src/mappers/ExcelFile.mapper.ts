import { ExcelFile } from 'src/entities';
import { RecordingInstitutionResponseDto } from 'src/recording-institution/dto/RecordingInstitutionResponse.dto';

export const baseExcelEntitieToBaseExcelFileResponseDto = (
  baseExcelFile: ExcelFile,
  recordingInstitution: RecordingInstitutionResponseDto,
) => {
  return {
    id: baseExcelFile.id,
    filename: baseExcelFile.filename,
    recordingInstitution,
    status: baseExcelFile.status,
  };
};
