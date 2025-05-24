import { ExcelFile } from 'src/entities';
import { RecordingInstitutionResponseDto } from 'src/recording-institution/dto/RecordingInstitutionResponse.dto';

export const baseExcelEntitieToBaseExcelFileResponseDto = (
  baseExcelFile: ExcelFile,
  recordingInstitution: RecordingInstitutionResponseDto,
  fileurl: string,
) => {
  return {
    id: baseExcelFile.id,
    filename: baseExcelFile.filename,
    recordingInstitution,
    fileurl,
    status: baseExcelFile.status,
  };
};
