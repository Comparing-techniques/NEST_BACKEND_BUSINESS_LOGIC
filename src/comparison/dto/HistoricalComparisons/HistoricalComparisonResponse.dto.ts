import { CreateBaseMovementResponseDto } from '../BaseMovement/CreateBaseMovementResponse.dto';
import { ComparativeMovementResponseDto } from '../CompartiveMovement/ComparativeMovementResponse.dto';

export class HistoricalComparisonResponseDto {
  id: number;
  baseMovement: CreateBaseMovementResponseDto;
  comparativeMovement: ComparativeMovementResponseDto;
  dateTime: Date;
  status: boolean;
}
