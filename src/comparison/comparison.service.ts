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
import { BaseMovement } from 'src/entities';
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
import { ComparativeMovementRequestDto } from './dto/CompartiveMovement/ComparativeMovementRequest.dto';
import { HistoricalComparisonsService } from './services/historical-comparisons/historical-comparisons.service';


@Injectable()
export class ComparisonService {
  constructor(
    @InjectRepository(BaseMovement)
    private readonly baseMovementRepository: Repository<BaseMovement>,

    private readonly authService: AuthService,
    private readonly jointService: JointService,
    private readonly excelFilesService: ExcelFilesService,
    private readonly videoRecordingsService: VideoRecordingsService,
    private readonly firebaseStorageService: FirebaseStorageService,
    private readonly feedbackConnectionService: FeedbackConnectionService,
    private readonly recordingInstitutionService: RecordingInstitutionService,
    private readonly comparativeMovementsService: ComparativeMovementsService,
    private readonly historicalComparisonsService: HistoricalComparisonsService,
  ) {}

  async create(createComparisonDto: CreateComparisonRequestDto) {
    try {
      const { userId, recordingInstitutionId, baseExcelFileId, excelFileCompare } = createComparisonDto;

      const userCreator = await this.authService.findUserById(
        parseInt(userId),
        'token',
      );

      if (!userCreator)
        throw new BadRequestException(
          notFoundById(parseInt(userId), 'User'),
        );

      const recordingInstitution =
        await this.recordingInstitutionService.findOne(
          parseInt(recordingInstitutionId),
        );
      
      if (!recordingInstitution)
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
        throw new BadRequestException(notFoundById(baseExcelFileId, 'Base Excel File'));

      if (!isAllowedExtension(excelFileCompare, 'excel'))
        throw new BadRequestException(invalidFileType(excelFileCompare.originalname));

      const excelCompareFile = await this.excelFilesService.createExcelRecording(
        {
          fileName: excelFileCompare.originalname,
          file: excelFileCompare,
        },
        userCreator.id,
        parseInt(recordingInstitution.id),
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

      if (!excelCompareFile) {
        throw new InternalServerErrorException('No se encontró el archivo Excel registrado.');
      }

      const comparativeMovement = await this.comparativeMovementsService.createComparativeMovement({
        excelFileId: excelCompareFile.id,
        status: true,
      });

      await this.historicalComparisonsService.createHistoricalComparison({
        baseMovementId: baseMovement.id,
        comparativeMovementId: comparativeMovement.id,
        status: true,
      });

      const feedbackResult = await this.feedbackConnectionService.sendFeedbackRequest(
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

      const userCreator = await this.authService.findUserById(
        parseInt(baseMovementRequest.userId),
        'token',
      );

      const recordingInstitution =
        await this.recordingInstitutionService.findOne(
          parseInt(baseMovementRequest.recordingInstitutionId),
        );

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
        userCreator.id,
        parseInt(recordingInstitution.id),
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
            recordingInstitution,
            excelRecorded.fileUrl,
          ),
          videoRecordingEntitieToVideoRecordingResponseDto(
            videoRecorded,
            videoRecorded.fileUrl,
          ),
          jointEntitieToJointResponseDto(initialJoint),
          userCreator,
        );

      return baseMovementResponseDto;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private async validateFiles(
    baseMovementRequest: CreateBaseMovementRequestDto,
  ) {
    console.log(baseMovementRequest);
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
