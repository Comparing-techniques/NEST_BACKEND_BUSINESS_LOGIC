/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateComparisonRequestDto } from './dto/CreateComparisonRequest.dto';
import { AuthService } from 'src/auth/auth.service';
import { JointService } from 'src/joint/joint.service';
import { RecordingInstitutionService } from 'src/recording-institution/recording-institution.service';
import { ExcelFilesService } from './services/excel-files/excel-files.service';
import { VideoRecordingsService } from './services/video-recordings/video-recordings.service';
import { CreateBaseMovementRequestDto } from './dto/BaseMovement/CreateBaseMovementRequest.dto';
import {
  fileAlreadyExists,
  invalidFileType,
  isAllowedExtension,
} from 'src/utils/FilesValidations';
import { BaseMovement, ExcelFile, User } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { notFoundById } from 'src/utils/DtoValidators';
import { CreateBaseMovementResponseDto } from './dto/BaseMovement/CreateBaseMovementResponse.dto';
import { baseMovementEntitieToBaseMovementResponseDto } from 'src/mappers/BaseMovement.mapper';
import { baseExcelEntitieToBaseExcelFileResponseDto } from 'src/mappers/ExcelFile.mapper';
import { videoRecordingEntitieToVideoRecordingResponseDto } from 'src/mappers/VideoRecording.mapper';
import { jointEntitieToJointResponseDto } from 'src/mappers/Joint.mapper';
import { FeedbackConnectionService } from './services/feedback-connection/feedback-connection.service';
import { FirebaseStorageService } from 'src/Storage/firebasestorage.service';
import { ComparativeMovementsService } from './services/comparative-movements/comparative-movements.service';
import { HistoricalComparisonsService } from './services/historical-comparisons/historical-comparisons.service';
import { ComparisonResponse } from './dto/ComparisonResponse.dto';
import { HistoricalComparisonResponseDto } from './dto/HistoricalComparisons/HistoricalComparisonResponse.dto';
import { RecordingInstitution } from '../entities/RecordingInstitution.entity';
import { RecordingInstitutionEntitieToRecordingInstitutionResponseDto } from 'src/mappers/RecordingInstitution.mapper';
import { userEntityToResponseDto } from 'src/mappers/User.mapper';
import { BaseMovementsService } from './services/base-movements/base-movements.service';

@Injectable()
export class ComparisonService {
  constructor(
    @InjectRepository(BaseMovement)
    private readonly baseMovementRepository: Repository<BaseMovement>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(RecordingInstitution)
    private readonly recordingInstitutionRepository: Repository<RecordingInstitution>,

    @InjectRepository(ExcelFile)
    private readonly excelFileRepository: Repository<ExcelFile>,

    private readonly baseMovementsService: BaseMovementsService,
    private readonly jointService: JointService,
    private readonly excelFilesService: ExcelFilesService,
    private readonly videoRecordingsService: VideoRecordingsService,
    private readonly firebaseStorageService: FirebaseStorageService,
    private readonly feedbackConnectionService: FeedbackConnectionService,
    private readonly comparativeMovementsService: ComparativeMovementsService,
    private readonly historicalComparisonsService: HistoricalComparisonsService,
  ) {}

  async getComparisonsByUserIdThatMadeTheComparison(
    userId: number,
  ): Promise<HistoricalComparisonResponseDto[]> {
    try {
      const historicalComparisons =
        await this.historicalComparisonsService.findAllByUserIdThatMadeTheComparison(
          userId,
        );

      return historicalComparisons;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getComparisonByHistoricalId(historicalId: number) {
    try {
      const historicalComparison: ComparisonResponse =
        await this.historicalComparisonsService.findOne(historicalId);

      if (!historicalComparison)
        throw new BadRequestException(
          notFoundById(historicalId, 'Historical Comparison'),
        );

      return historicalComparison;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAllBaseMovements() {
    return await this.baseMovementsService.findAll();
  }

  async create(createComparisonDto: CreateComparisonRequestDto) {
    try {
      const {
        userId,
        recordingInstitutionId,
        baseExcelFileId,
        excelFileCompare,
      } = createComparisonDto;

      const userEntitie = await this.userRepository.findOne({
        where: { id: parseInt(userId) },
      });

      if (!userEntitie)
        throw new BadRequestException(notFoundById(parseInt(userId), 'User'));

      const recordingInstitutionEntitie =
        await this.recordingInstitutionRepository.findOne({
          where: { id: parseInt(recordingInstitutionId) },
        });

      if (!recordingInstitutionEntitie)
        throw new BadRequestException(
          notFoundById(
            parseInt(recordingInstitutionId),
            'Recording Institution',
          ),
        );

      const baseMovement = await this.baseMovementRepository.findOne({
        where: { id: parseInt(baseExcelFileId) },
        relations: ['excelFile'],
      });

      if (!baseMovement)
        throw new BadRequestException(
          notFoundById(baseExcelFileId, 'Base Excel File'),
        );

      if (!isAllowedExtension(excelFileCompare, 'excel'))
        throw new BadRequestException(
          invalidFileType(excelFileCompare.originalname),
        );

      const existExcelComparativeMovement =
        await this.excelFilesService.existsExcelFileByFileName(
          excelFileCompare.originalname,
        );

      let excelCompareFile: ExcelFile;
      if (!existExcelComparativeMovement) {
        excelCompareFile = await this.excelFilesService.createExcelRecording(
          {
            fileName: excelFileCompare.originalname,
            file: excelFileCompare,
          },
          userEntitie,
          recordingInstitutionEntitie,
        );
      } else {
        const excelFile = await this.excelFileRepository.findOne({
          where: { filename: excelFileCompare.originalname },
        });

        if (!excelFile) {
          throw new InternalServerErrorException(
            excelFileCompare.originalname,
            'No se encontró el archivo Excel al buscarlo por nombre.',
          );
        }

        excelCompareFile = excelFile;
      }

      const buffer = await this.firebaseStorageService.downloadFileToBuffer(
        `excel/${baseMovement.excelFile.filename}/${baseMovement.excelFile.filename}`,
      );

      const baseExcelFile: Express.Multer.File = {
        originalname: baseMovement.excelFile.filename,
        mimetype:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer,
      } as Express.Multer.File;

      if (!excelCompareFile) {
        throw new InternalServerErrorException(
          'No se encontró el archivo Excel registrado.',
        );
      }

      console.log('Excel comparar');
      console.log(excelCompareFile);
      const comparativeMovement =
        await this.comparativeMovementsService.createComparativeMovement({
          excelFileId: excelCompareFile.id,
          status: true,
        });

      await this.historicalComparisonsService.createHistoricalComparison({
        baseMovementId: baseMovement.id,
        comparativeMovementId: comparativeMovement.id,
        status: true,
      });

      const feedbackResult =
        await this.feedbackConnectionService.sendFeedbackRequest(
          baseExcelFile,
          excelFileCompare,
          baseMovement.initialJoint.id,
        );

      return feedbackResult;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createBaseMovement(baseMovementRequest: CreateBaseMovementRequestDto) {
    try {
      await this.validateFiles(baseMovementRequest);

      const userCreator = await this.userRepository.findOne({
        where: { id: parseInt(baseMovementRequest.userId) },
      });

      const recordingInstitution =
        await this.recordingInstitutionRepository.findOne({
          where: { id: parseInt(baseMovementRequest.recordingInstitutionId) },
        });

      const initialJoint = await this.jointService.findOne(
        parseInt(baseMovementRequest.initialJointId),
      );

      if (!userCreator)
        throw new BadRequestException(
          notFoundById(parseInt(baseMovementRequest.userId), 'User'),
        );

      if (!recordingInstitution)
        throw new BadRequestException(
          notFoundById(
            parseInt(baseMovementRequest.recordingInstitutionId),
            'Recording Institution',
          ),
        );

      if (!initialJoint)
        throw new BadRequestException(
          notFoundById(parseInt(baseMovementRequest.initialJointId), 'Joint'),
        );

      const videoRecorded =
        await this.videoRecordingsService.createVideoRecording({
          fileName: baseMovementRequest.videoRecordingFile.originalname,
          videoFile: baseMovementRequest.videoRecordingFile,
        });

      const excelRecorded = await this.excelFilesService.createExcelRecording(
        {
          fileName: baseMovementRequest.excelFile.originalname,
          file: baseMovementRequest.excelFile,
        },
        userCreator,
        recordingInstitution,
      );

      const baseMovementToDB = this.baseMovementRepository.create({
        excelFile: excelRecorded,
        videoRecording: videoRecorded,
        initialJoint,
      });

      const baseMovement =
        await this.baseMovementRepository.save(baseMovementToDB);

      const baseMovementResponseDto: CreateBaseMovementResponseDto =
        baseMovementEntitieToBaseMovementResponseDto(
          baseMovement,
          baseExcelEntitieToBaseExcelFileResponseDto(
            excelRecorded,
            RecordingInstitutionEntitieToRecordingInstitutionResponseDto(
              recordingInstitution,
            ),
            excelRecorded.fileUrl,
          ),
          videoRecordingEntitieToVideoRecordingResponseDto(
            videoRecorded,
            videoRecorded.fileUrl,
          ),
          jointEntitieToJointResponseDto(initialJoint),
          userEntityToResponseDto(userCreator),
        );

      return baseMovementResponseDto;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private async validateFiles(
    baseMovementRequest: CreateBaseMovementRequestDto,
  ) {
    const existVideoRecording =
      await this.videoRecordingsService.existsVideoRecordingByFileName(
        baseMovementRequest['videoRecordingFile'].originalname,
      );

    const existExcelFile =
      await this.excelFilesService.existsExcelFileByFileName(
        baseMovementRequest['excelFile'].originalname,
      );

    if (existVideoRecording)
      throw new BadRequestException(
        fileAlreadyExists(
          baseMovementRequest.videoRecordingFile.originalname,
          'Video',
        ),
      );

    if (existExcelFile)
      throw new BadRequestException(
        fileAlreadyExists(baseMovementRequest.excelFile.originalname, 'Excel'),
      );

    if (!isAllowedExtension(baseMovementRequest.excelFile, 'excel'))
      throw new BadRequestException(
        invalidFileType(baseMovementRequest.excelFile.originalname),
      );

    if (!isAllowedExtension(baseMovementRequest.videoRecordingFile, 'video'))
      throw new BadRequestException(
        invalidFileType(baseMovementRequest.videoRecordingFile.originalname),
      );
  }
}
