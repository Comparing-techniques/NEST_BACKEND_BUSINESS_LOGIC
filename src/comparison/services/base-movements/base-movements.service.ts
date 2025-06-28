import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseMovement } from 'src/entities/BaseMovement.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BaseMovementsService {
    constructor(
        @InjectRepository(BaseMovement)
        private readonly baseMovementRepository: Repository<BaseMovement>,
    ) {}

    async findAll() {
        try {
            const baseMovements = await this.baseMovementRepository.find({
                relations: ['excelFile', 'videoRecording', 'initialJoint'],
                where: { status: true },
                order: { id: 'DESC' },
            });

            return baseMovements;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Error al obtener movimientos base');
        }
    }
}