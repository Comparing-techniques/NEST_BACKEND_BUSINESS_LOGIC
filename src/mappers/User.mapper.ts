import { User } from 'src/entities/User.entity';
import { UserResponseDto } from 'src/global_dtos/UserResponse.dto';


export function userEntityToResponseDto(user: User): UserResponseDto {
  return {
    id: user.id,
    identificationNumber: user.identificationNumber,
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    superuser: user.superuser,
    status: user.status,
    position: {
      id: String(user.position.id),
      description: user.position.description,
      status: user.position.status,
    },
  };
}

export function userEntityToResponseDtoList(users: User[]): UserResponseDto[] {
  return users.map(userEntityToResponseDto);
}
