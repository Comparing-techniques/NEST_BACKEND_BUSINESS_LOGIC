import { SaveExcelFileResponseDto } from '../ExcelFile/SaveExcelFileResponse.dto';

export class ComparativeMovementResponseDto {
  id: number;
  excelCompareFile: SaveExcelFileResponseDto;
  status: boolean;
}
