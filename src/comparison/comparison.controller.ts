/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UseGuards,
  UploadedFiles,
  BadRequestException,
  InternalServerErrorException,
  Get,
  Param,
} from '@nestjs/common';
import { ComparisonService } from './comparison.service';
import { CreateComparisonRequestDto } from './dto/CreateComparisonRequest.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UserGuardGuard } from 'src/auth/auth-guard/user-guard.guard';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateBaseMovementRequestDto } from './dto/BaseMovement/CreateBaseMovementRequest.dto';
import {
  noFilesProvided,
  noOneFilesProvided,
  noTwoFilesProvided,
} from 'src/utils/FilesValidations';

@Controller('comparison')
export class ComparisonController {
  UserGuardGuard: any;
  constructor(private readonly comparisonService: ComparisonService) {}

  @Get('/historical/:id')
  @UseGuards(UserGuardGuard)
  async findOneByHistoricalId(@Param('id') historicalId: number) {
    return await this.comparisonService.getComparisonByHistoricalId(
      historicalId,
    );
  }

  @Get('/user/:id')
  @UseGuards(UserGuardGuard)
  async findComparisonsMadeByUserId(@Param('id') userId: number) {
    return await this.comparisonService.getComparisonsByUserIdThatMadeTheComparison(
      userId,
    );
  }

  @Post()
  @UseGuards(UserGuardGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: any,
  ) {
    try {
      const fileMap: { [key: string]: Express.Multer.File } = {};

      if (!files || files.length === 0) {
        throw new BadRequestException(noFilesProvided());
      }

      if (files.length !== 1) {
        throw new BadRequestException(noOneFilesProvided());
      }

      files.forEach((file) => {
        fileMap[file.fieldname] = file;
      });

      if (!fileMap['excelFileCompare']) {
        throw new BadRequestException(noFilesProvided());
      }

      const createComparisonDtoToService = plainToInstance(
        CreateComparisonRequestDto,
        {
          userId: body.userId,
          recordingInstitutionId: body.recordingInstitutionId,
          baseExcelFileId: body.baseExcelFileId,
          excelFileCompare: fileMap['excelFileCompare'],
        },
      );

      const errors = await validate(createComparisonDtoToService);
      if (errors.length > 0)
        throw new BadRequestException(
          errors.map((e) => ({
            property: e.property,
            constraints: e.constraints,
          })),
        );

      const response = await this.comparisonService.create(
        createComparisonDtoToService,
      );
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('/add-base-movement')
  @UseGuards(UserGuardGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async addBaseMovement(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: any,
  ) {
    try {
      const fileMap: { [key: string]: Express.Multer.File } = {};

      if (!files || files.length === 0) {
        throw new BadRequestException(noFilesProvided());
      }

      if (files.length !== 2) {
        throw new BadRequestException(noTwoFilesProvided());
      }
      files.forEach((file) => {
        fileMap[file.fieldname] = file;
      });

      const createBaseMovementRequest = plainToInstance(
        CreateBaseMovementRequestDto,
        {
          userId: body.userId,
          initialJointId: body.initialJointId,
          recordingInstitutionId: body.recordingInstitutionId,
          excelFile: fileMap['excelFile'],
          videoRecordingFile: fileMap['videoRecordingFile'],
        },
      );

      return await this.comparisonService.createBaseMovement(
        createBaseMovementRequest,
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
