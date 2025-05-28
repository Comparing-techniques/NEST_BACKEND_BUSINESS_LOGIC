import { IsBoolean, IsDefined, Matches } from 'class-validator';
import { noEmptyField, invalidInt } from 'src/utils/DtoValidators';


export class HistoricalComparisonRequestDto {
  @IsDefined({ message: noEmptyField('baseMovementId en HistoricalComparisonRequest') })
  @Matches(/^[1-9]\d*$/, { message: invalidInt('baseMovementId en HistoricalComparisonRequest') })
  baseMovementId: number | string;

  @IsDefined({ message: noEmptyField('comparativeMovementId en HistoricalComparisonRequest') })
  @Matches(/^[1-9]\d*$/, { message: invalidInt('comparativeMovementId en HistoricalComparisonRequest') })
  comparativeMovementId: number | string;

  @IsDefined({ message: noEmptyField('status en HistoricalComparisonRequest') })
  @IsBoolean({ message: 'El campo status debe ser booleano' })
  status: boolean;
}
