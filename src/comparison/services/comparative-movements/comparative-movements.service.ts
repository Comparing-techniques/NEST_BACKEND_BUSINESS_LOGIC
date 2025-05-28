import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComparativeMovementRequestDto } from 'src/comparison/dto/CompartiveMovement/ComparativeMovementRequest.dto';
import { ComparativeMovement } from 'src/entities';
import { Repository } from 'typeorm';


@Injectable()
export class ComparativeMovementsService {

  constructor(
    @InjectRepository(ComparativeMovement)
    private readonly comparativeMovementRepository: Repository<ComparativeMovement>,
  ) {}

  async createComparativeMovement( comparativeMovement: ComparativeMovementRequestDto ): Promise<ComparativeMovement> {
    try {

      const newMovement = this.comparativeMovementRepository.create(comparativeMovement);
      return await this.comparativeMovementRepository.save(newMovement);

    } catch (error) {
      throw new InternalServerErrorException('Error al guardar el movimiento comparativo.');
    }
  }
}