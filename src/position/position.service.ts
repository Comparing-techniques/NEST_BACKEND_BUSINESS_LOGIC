import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Position } from 'src/entities';
import { Repository } from 'typeorm';
import { alreadyExists, notFoundById } from 'src/utils/DtoValidators';
import {
  positionEntitieToPositionResponseDto,
  positionEntitieToPositionResponseDtoList,
} from 'src/mappers/Position.mapper';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}

  async create(createPositionDto: CreatePositionDto) {
    try {
      const position = this.positionRepository.create(createPositionDto);
      return positionEntitieToPositionResponseDto(
        await this.positionRepository.save(position),
      );
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code && error.code === '23505')
        throw new BadRequestException(
          alreadyExists(
            createPositionDto.description,
            'description',
            'Position',
          ),
        );
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try {
      const positions = await this.positionRepository.find({
        where: { status: true },
      });

      if (positions && positions.length > 0)
        return positionEntitieToPositionResponseDtoList(positions);

      return [];
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: number) {
    try {
      const position = await this.positionRepository.findOne({
        where: { id, status: true },
      });

      if (!position)
        throw new BadRequestException(notFoundById(id, 'Position'));

      return positionEntitieToPositionResponseDto(position);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, updatePositionDto: UpdatePositionDto) {
    try {
      const originalPosition = await this.positionRepository.findOneBy({ id });
      if (!originalPosition)
        throw new BadRequestException(notFoundById(id, 'Position'));

      const updateResult = await this.positionRepository.update(
        id,
        updatePositionDto,
      );

      if (updateResult.affected === 0)
        return positionEntitieToPositionResponseDto(originalPosition);

      const updated = await this.positionRepository.findOneBy({ id });
      if (updated) return positionEntitieToPositionResponseDto(updated);
      return [];
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code && error.code === '23505')
        throw new BadRequestException(
          alreadyExists(
            updatePositionDto.description,
            'description',
            'Position',
          ),
        );
      throw new BadRequestException(error);
    }
  }

  async remove(id: number) {
    try {
      const result = await this.positionRepository.delete({ id });

      if (result.affected === 0)
        throw new BadRequestException(notFoundById(id, 'Position'));
      return { message: 'Position deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
