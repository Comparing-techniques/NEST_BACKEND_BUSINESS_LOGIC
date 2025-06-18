import { ComparativeMovementResponseDto } from 'src/comparison/dto/CompartiveMovement/ComparativeMovementResponse.dto';
import { ComparativeMovement } from 'src/entities';
import { baseExcelEntitieToBaseExcelFileResponseDto } from './ExcelFile.mapper';
import { RecordingInstitutionEntitieToRecordingInstitutionResponseDto } from './RecordingInstitution.mapper';

export const comparativeMovementToComparativeResopnseDto = (
  comparativeMovement: ComparativeMovement,
): ComparativeMovementResponseDto => {
  return {
    id: comparativeMovement.id,
    excelCompareFile: baseExcelEntitieToBaseExcelFileResponseDto(
      comparativeMovement.excelFile,
      RecordingInstitutionEntitieToRecordingInstitutionResponseDto(
        comparativeMovement.excelFile.recordingInstitution,
      ),
      comparativeMovement.excelFile.fileUrl,
    ),
    status: comparativeMovement.status,
  };
};
