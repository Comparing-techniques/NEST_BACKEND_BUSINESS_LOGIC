import { Joint } from 'src/entities';
import { JointResponseDto } from '../joint/dto/JointResponse.dto';

export const jointEntitieToJointResponseDto = (
  joint: Joint,
): JointResponseDto => {
  return {
    id: joint.id,
    jointName: joint.jointName,
    status: joint.status,
  };
};

export const jointEntitieToJointResponseDtoList = (
  joints: Joint[],
): JointResponseDto[] => {
  return joints.map((joint) => jointEntitieToJointResponseDto(joint));
};
