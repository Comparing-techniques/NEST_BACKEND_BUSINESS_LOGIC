import { RecordingInstitution } from 'src/entities';
import { RecordingInstitutionResponseDto } from 'src/recording-institution/dto/RecordingInstitutionResponse.dto';

export const RecordingInstitutionEntitieToRecordingInstitutionResponseDto = (
  recordingInstitution: RecordingInstitution,
): RecordingInstitutionResponseDto => {
  return {
    id: String(recordingInstitution.id),
    description: recordingInstitution.description,
    status: recordingInstitution.status,
  };
};

export const RecordingInstitutionEntitieToRecordingInstitutionResponseDtoList =
  (
    recordingInstitutionEntity: RecordingInstitution[],
  ): RecordingInstitutionResponseDto[] => {
    return recordingInstitutionEntity.map((recordingInstitution) =>
      RecordingInstitutionEntitieToRecordingInstitutionResponseDto(
        recordingInstitution,
      ),
    );
  };
