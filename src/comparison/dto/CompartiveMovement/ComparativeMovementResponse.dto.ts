import { UserResponseDto } from 'src/global_dtos/UserResponse.dto';
import { SaveExcelFileResponseDto } from '../ExcelFile/SaveExcelFileResponse.dto';

export class ComparativeMovementResponseDto {
  id: number;
  excelCompareFile: SaveExcelFileResponseDto;
  user: UserResponseDto;
  status: boolean;
}
