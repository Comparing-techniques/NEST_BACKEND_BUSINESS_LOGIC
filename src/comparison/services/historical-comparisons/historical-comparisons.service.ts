/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComparisonResponse } from 'src/comparison/dto/ComparisonResponse.dto';
import { HistoricalComparisonRequestDto } from 'src/comparison/dto/HistoricalComparisons/HistoricalComparisonRequest.dto';
import {
  BaseMovement,
  ComparativeMovement,
  HistoricalComparison,
} from 'src/entities';

import { notFoundById } from 'src/utils/DtoValidators';
import { Repository } from 'typeorm';
import { FeedbackConnectionService } from '../feedback-connection/feedback-connection.service';
import { isAllowedExtension } from 'src/utils/FilesValidations';
import { FirebaseStorageService } from 'src/Storage/firebasestorage.service';

@Injectable()
export class HistoricalComparisonsService {
  constructor(
    @InjectRepository(HistoricalComparison)
    private readonly historicalComparisonRepository: Repository<HistoricalComparison>,

    @InjectRepository(BaseMovement)
    private readonly baseMovementRepository: Repository<BaseMovement>,

    @InjectRepository(ComparativeMovement)
    private readonly comparativeMovementRepository: Repository<ComparativeMovement>,
    private readonly feedbackConnectionService: FeedbackConnectionService,
    private readonly firebaseStorageService: FirebaseStorageService,
  ) {}

  async findOne(historicalId: number): Promise<ComparisonResponse> {
    try {
      const historicalComparison =
        await this.historicalComparisonRepository.findOne({
          where: { id: Number(historicalId) },
        });

      if (!historicalComparison)
        throw new BadRequestException(
          notFoundById(historicalId, 'Historical Comparison'),
        );

      const baseMovement = await this.baseMovementRepository.findOne({
        where: { id: historicalComparison.baseMovement.id },
        relations: ['excelFile'],
      });

      if (!baseMovement)
        throw new BadRequestException(
          notFoundById(
            historicalComparison.baseMovement.excelFile.id,
            'Base Excel File',
          ),
        );
      const excelCompareFile = await this.comparativeMovementRepository.findOne(
        {
          where: { id: historicalComparison.comparativeMovement.id },
          relations: ['excelFile'],
        },
      );

      if (!excelCompareFile)
        throw new BadRequestException(
          notFoundById(
            historicalComparison.comparativeMovement.excelFile.id,
            'Compare Excel File',
          ),
        );

      const bufferCompareMovement =
        await this.firebaseStorageService.downloadFileToBuffer(
          `excel/${baseMovement.excelFile.filename}/${baseMovement.excelFile.filename}`,
        );

      const buffer = await this.firebaseStorageService.downloadFileToBuffer(
        `excel/${baseMovement.excelFile.filename}/${baseMovement.excelFile.filename}`,
      );

      const baseExcelFile: Express.Multer.File = {
        originalname: baseMovement.excelFile.filename,
        mimetype:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer,
      } as Express.Multer.File;

      const compareExcelFileToFeedback: Express.Multer.File = {
        originalname: baseMovement.excelFile.filename,
        mimetype:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer,
      } as Express.Multer.File;

      if (!excelCompareFile) {
        throw new InternalServerErrorException(
          'No se encontró el archivo Excel registrado como base.',
        );
      }

      if (!compareExcelFileToFeedback) {
        throw new InternalServerErrorException(
          'No se encontró el archivo Excel registrado a comparar.',
        );
      }

      const feedbackResult: ComparisonResponse =
        await this.feedbackConnectionService.sendFeedbackRequest(
          compareExcelFileToFeedback,
          baseExcelFile,
          historicalComparison.baseMovement.initialJoint.id,
        );

      return feedbackResult;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createHistoricalComparison(
    dto: HistoricalComparisonRequestDto,
  ): Promise<HistoricalComparison> {
    try {
      const baseMovement = await this.baseMovementRepository.findOne({
        where: { id: Number(dto.baseMovementId) },
      });

      const comparativeMovement =
        await this.comparativeMovementRepository.findOne({
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
      throw new InternalServerErrorException(
        'Error al crear historial comparativo',
      );
    }
  }
}
