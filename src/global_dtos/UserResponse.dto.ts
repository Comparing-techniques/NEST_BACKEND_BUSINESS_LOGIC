import { positionResponseDto } from '../position/dto/PositionResponse.dto';

export class UserResponseDto {
  id: number;
  identificationNumber: string;
  name: string;
  lastName: string;
  email: string;
  superuser: boolean;
  status: boolean;
  position: positionResponseDto;
  token: string;
}
