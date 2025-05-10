import { UserResponseDto } from 'src/global_dtos/UserResponse.dto';
import { positionResponseDto } from 'src/position/dto/PositionResponse.dto';
import { User } from 'src/entities';

export const userEntitieToUserResponseDtoWithToken = (
  registeredUser: User,
  position: positionResponseDto,
  token: string,
): UserResponseDto => {
  return {
    id: registeredUser.id,
    identificationNumber: registeredUser.identificationNumber,
    name: registeredUser.name,
    lastName: registeredUser.lastName,
    email: registeredUser.email,
    superuser: registeredUser.superuser,
    status: registeredUser.status,
    position: position,
    token: token,
  };
};
