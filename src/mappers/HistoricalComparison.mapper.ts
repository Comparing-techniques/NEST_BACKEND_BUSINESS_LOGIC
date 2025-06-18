import { CreateBaseMovementResponseDto } from 'src/comparison/dto/BaseMovement/CreateBaseMovementResponse.dto';
import { HistoricalComparisonResponseDto } from 'src/comparison/dto/HistoricalComparisons/HistoricalComparisonResponse.dto';
import { HistoricalComparison } from 'src/entities';
import { ComparativeMovementResponseDto } from 'src/comparison/dto/CompartiveMovement/ComparativeMovementResponse.dto';
import { baseMovementEntitieToBaseMovementResponseDto } from './BaseMovement.mapper';
import { baseExcelEntitieToBaseExcelFileResponseDto } from './ExcelFile.mapper';
import { RecordingInstitutionEntitieToRecordingInstitutionResponseDto } from './RecordingInstitution.mapper';
import { videoRecordingEntitieToVideoRecordingResponseDto } from './VideoRecording.mapper';
import { userEntityToResponseDto } from './User.mapper';
import { comparativeMovementToComparativeResopnseDto } from './ComparativeMovement.mapper';

export const historicalToHistoricalResponseDto = (
  historicalComparison: HistoricalComparison,
  baseMovement: CreateBaseMovementResponseDto,
  comparativeMovement: ComparativeMovementResponseDto,
): HistoricalComparisonResponseDto => {
  return {
    id: historicalComparison.id,
    baseMovement,
    comparativeMovement,
    dateTime: historicalComparison.dateTime,
    status: historicalComparison.status,
  };
};

export const historicalListToHistoricalResponseDtoList = (
  historicals: HistoricalComparison[],
): HistoricalComparisonResponseDto[] => {
  return historicals.map((hc) => {
    const baseMovement: CreateBaseMovementResponseDto =
      baseMovementEntitieToBaseMovementResponseDto(
        hc.baseMovement,
        baseExcelEntitieToBaseExcelFileResponseDto(
          hc.baseMovement.excelFile,
          RecordingInstitutionEntitieToRecordingInstitutionResponseDto(
            hc.baseMovement.excelFile.recordingInstitution,
          ),
          hc.baseMovement.excelFile.fileUrl,
        ),
        videoRecordingEntitieToVideoRecordingResponseDto(
          hc.baseMovement.videoRecording,
          hc.baseMovement.videoRecording.fileUrl,
        ),
        hc.baseMovement.initialJoint,
        userEntityToResponseDto(hc.baseMovement.excelFile.uploader),
      );

    const comparisonMovement: ComparativeMovementResponseDto =
      comparativeMovementToComparativeResopnseDto(hc.comparativeMovement);

    return historicalToHistoricalResponseDto(
      hc,
      baseMovement,
      comparisonMovement,
    );
  });
};
