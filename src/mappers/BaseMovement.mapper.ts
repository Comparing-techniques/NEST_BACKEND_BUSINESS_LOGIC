import { BaseMovement } from '../entities/BaseMovement.entity';
import { SaveExcelFileResponseDto } from '../comparison/dto/ExcelFile/SaveExcelFileResponse.dto';
import { JointResponseDto } from 'src/joint/dto/JointResponse.dto';
import { UserResponseDto } from 'src/global_dtos/UserResponse.dto';
import { SaveVideoRecordingResponseDto } from 'src/comparison/dto/VideoRecording/SaveVideoRecordingResponse.dto';
export const baseMovementEntitieToBaseMovementResponseDto = (
  baseMovement: BaseMovement,
  baseExcelFile: SaveExcelFileResponseDto,
  videoRecording: SaveVideoRecordingResponseDto,
  joint: JointResponseDto,
  user: UserResponseDto,
) => {
  return {
    id: baseMovement.id,
    user,
    baseExcelFile,
    videoRecording,
    joint,
    status: baseMovement.status,
  };
};
