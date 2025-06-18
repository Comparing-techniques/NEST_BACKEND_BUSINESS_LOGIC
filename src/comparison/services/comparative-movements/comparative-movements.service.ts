/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

  async createComparativeMovement(
    comparativeMovement: ComparativeMovementRequestDto,
  ): Promise<ComparativeMovement> {
    try {
      const excelId = Number(comparativeMovement.excelFileId);
      if (!excelId) {
        throw new InternalServerErrorException(
          'El ID del archivo Excel a comparar es requerido.',
        );
      }

      if (isNaN(excelId)) {
        throw new InternalServerErrorException(
          'El ID del archivo Excel a comparar debe ser un número válido.',
        );
      }

      const newMovement = new ComparativeMovement();
      newMovement.status = true;
      newMovement.excelFile = { id: excelId } as any;

      return await this.comparativeMovementRepository.save(newMovement);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al guardar el movimiento comparativo.',
      );
    }
  }
}
