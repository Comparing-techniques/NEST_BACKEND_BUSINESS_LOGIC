import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateJointDto } from './dto/create-joint.dto';
import { UpdateJointDto } from './dto/update-joint.dto';
import { Joint } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { alreadyExists, notFoundById } from 'src/utils/DtoValidators';
import {
  jointEntitieToJointResponseDto,
  jointEntitieToJointResponseDtoList,
} from 'src/mappers/Joint.mapper';

@Injectable()
export class JointService {
  constructor(
    @InjectRepository(Joint)
    private readonly jointRepository: Repository<Joint>,
  ) {}

  async create(createJointDto: CreateJointDto) {
    try {
      const joint = this.jointRepository.create(createJointDto);
      return jointEntitieToJointResponseDto(
        await this.jointRepository.save(joint),
      );
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code && error.code === '23505')
        throw new BadRequestException(
          alreadyExists(createJointDto.jointName, 'jointName', 'Joint'),
        );
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try {
      const joints = await this.jointRepository.find({
        where: { status: true },
      });

      if (joints && joints.length > 0)
        return jointEntitieToJointResponseDtoList(joints);

      return [];
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: number) {
    try {
      const joint = await this.jointRepository.findOne({
        where: { id, status: true },
      });

      if (!joint) throw new BadRequestException(notFoundById(id, 'Joint'));

      return jointEntitieToJointResponseDto(joint);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, updateJointDto: UpdateJointDto) {
    try {
      const originalJoint = await this.jointRepository.findOneBy({ id });
      if (!originalJoint)
        throw new BadRequestException(notFoundById(id, 'Joint'));

      const updateResult = await this.jointRepository.update(
        id,
        updateJointDto,
      );

      if (updateResult.affected === 0)
        return jointEntitieToJointResponseDto(originalJoint);

      const updated = await this.jointRepository.findOneBy({ id });
      if (updated) return jointEntitieToJointResponseDto(updated);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code && error.code === '23505')
        throw new BadRequestException(
          alreadyExists(updateJointDto.jointName, 'jointName', 'Joint'),
        );
      throw new BadRequestException(error);
    }
  }

  async remove(id: number) {
    try {
      const result = await this.jointRepository.delete({ id });

      if (result.affected === 0)
        throw new BadRequestException(notFoundById(id, 'joint'));
      return { message: 'Joint deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
