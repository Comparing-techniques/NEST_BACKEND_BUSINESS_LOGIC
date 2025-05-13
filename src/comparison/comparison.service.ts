/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateComparisonDto } from './dto/create-comparison.dto';
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
import { BaseMovement, User } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { notFoundById } from 'src/utils/DtoValidators';
import { CreateBaseMovementResponseDto } from './dto/BaseMovement/CreateBaseMovementResponse.dto';
import { baseMovementEntitieToBaseMovementResponseDto } from 'src/mappers/BaseMovement.mapper';
import { baseExcelEntitieToBaseExcelFileResponseDto } from 'src/mappers/ExcelFile.mapper';
import { videoRecordingEntitieToVideoRecordingResponseDto } from 'src/mappers/VideoRecording.mapper';
import { jointEntitieToJointResponseDto } from 'src/mappers/Joint.mapper';
import { userEntitieToUserResponseDtoWithToken } from 'src/mappers/Auth.mapper';

@Injectable()
export class ComparisonService {
  constructor(
    @InjectRepository(BaseMovement)
    private readonly baseMovementRepository: Repository<BaseMovement>,
    private readonly recordingInstitutionService: RecordingInstitutionService,
    private readonly videoRecordingsService: VideoRecordingsService,
    private readonly excelFilesService: ExcelFilesService,
    private readonly jointService: JointService,
    private readonly authService: AuthService,
  ) {}

  create(createComparisonDto: CreateComparisonDto) {
    console.log('createComparisonDto', createComparisonDto);
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
          ),
          videoRecordingEntitieToVideoRecordingResponseDto(videoRecorded),
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
