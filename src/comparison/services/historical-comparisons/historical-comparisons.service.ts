import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoricalComparisonRequestDto } from 'src/comparison/dto/HistoricalComparisons/HistoricalComparisonRequest.dto';
import { BaseMovement, ComparativeMovement, HistoricalComparison } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class HistoricalComparisonsService {

    constructor(
        @InjectRepository(HistoricalComparison)
        private readonly historicalComparisonRepository: Repository<HistoricalComparison>,  
        
        @InjectRepository(BaseMovement)
        private readonly baseMovementRepository: Repository<BaseMovement>,

        @InjectRepository(ComparativeMovement)
        private readonly comparativeMovementRepository: Repository<ComparativeMovement>,
    ) {}

    async createHistoricalComparison(dto: HistoricalComparisonRequestDto): Promise<HistoricalComparison> {
        try {
            const baseMovement = await this.baseMovementRepository.findOne({
                where: { id: Number(dto.baseMovementId) },
            });

            const comparativeMovement = await this.comparativeMovementRepository.findOne({
                where: { id: Number(dto.comparativeMovementId) },
            });

            if (!baseMovement || !comparativeMovement) {
                throw new BadRequestException('No se encontraron movimientos válidos');
            }

            const newHistorical = this.historicalComparisonRepository.create({
                baseMovement,
                comparativeMovement,
                status: dto.status,
                dateTime: new Date(),
            });

            return await this.historicalComparisonRepository.save(newHistorical);
            
        } catch (error) {
            throw new InternalServerErrorException('Error al crear historial comparativo');
        }
    }

}