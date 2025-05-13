import { SaveExcelFileResponseDto } from '../ExcelFile/SaveExcelFileResponse.dto';
import { SaveVideoRecordingResponseDto } from '../VideoRecording/SaveVideoRecordingResponse.dto';
import { JointResponseDto } from 'src/joint/dto/JointResponse.dto';
import { UserResponseDto } from 'src/global_dtos/UserResponse.dto';

export class CreateBaseMovementResponseDto {
  id: number;
  baseExcelFile: SaveExcelFileResponseDto;
  videoRecording: SaveVideoRecordingResponseDto;
  joint: JointResponseDto;
  status: boolean;
  user: UserResponseDto;
}
