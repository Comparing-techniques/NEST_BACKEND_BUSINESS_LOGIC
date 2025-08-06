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
    user: {
      id: comparativeMovement.excelFile.uploader.id,
      identificationNumber: comparativeMovement.excelFile.uploader.identificationNumber,
      name: comparativeMovement.excelFile.uploader.name,
      lastName: comparativeMovement.excelFile.uploader.lastName,
      superuser: comparativeMovement.excelFile.uploader.superuser,
      email: comparativeMovement.excelFile.uploader.email,
      status: comparativeMovement.excelFile.uploader.status,
      position: {
        id: String(comparativeMovement.excelFile.uploader.position.id),
        description: comparativeMovement.excelFile.uploader.position.description,
        status: comparativeMovement.excelFile.uploader.position.status,
      },
    },
    status: comparativeMovement.status,
  };
};
