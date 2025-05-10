import { positionResponseDto } from 'src/position/dto/PositionResponse.dto';
import { Position } from 'src/entities/Position.entity';

export const positionEntitieToPositionResponseDto = (
  positionEntity: Position,
): positionResponseDto => {
  return {
    id: String(positionEntity.id),
    description: positionEntity.description,
    status: positionEntity.status,
  };
};

export const positionEntitieToPositionResponseDtoList = (
  positionsEntity: Position[],
): positionResponseDto[] => {
  return positionsEntity.map((position) =>
    positionEntitieToPositionResponseDto(position),
  );
};
