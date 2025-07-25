import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExcelFile, User } from 'src/entities';
import { Repository } from 'typeorm';
import { SaveExcelFileRequestDto } from '../../dto/ExcelFile/SaveExcelFileRequest.dto';
import { FirebaseStorageService } from 'src/Storage/firebasestorage.service';
import { RecordingInstitution } from '../../../entities/RecordingInstitution.entity';

@Injectable()
export class ExcelFilesService {
  constructor(
    @InjectRepository(ExcelFile)
    private readonly excelFileRepository: Repository<ExcelFile>,
    private readonly firebaseStorageService: FirebaseStorageService,
  ) {}

  async existsExcelFileByFileName(fileName: string) {
    try {
      return await this.excelFileRepository.exists({
        where: { filename: fileName, status: true },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOneExcelFileByFileName(fileName: string): Promise<number | null> {
    const file = await this.excelFileRepository.findOne({
      where: { filename: fileName },
    });
    return file ? file.id : null;
  }

  async createExcelRecording(
    saveExcelFileRequestDto: SaveExcelFileRequestDto,
    user: User,
    recordingInstitution: RecordingInstitution,
  ) {
    try {
      const filePath = `excel/${saveExcelFileRequestDto.fileName}`;

      const excelUrl = await this.firebaseStorageService.uploadFile(
        saveExcelFileRequestDto.file,
        filePath,
      );

      const excelFileObj = this.excelFileRepository.create({
        filename: saveExcelFileRequestDto.fileName,
        uploader: user,
        recordingInstitution,
        fileUrl: excelUrl,
      });

      const savedExcelRecording =
        await this.excelFileRepository.save(excelFileObj);
      return savedExcelRecording;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
