import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveVideoRecordingRequestDto } from 'src/comparison/dto/VideoRecording/SaveVideoRecordingRequest.dto';
import { VideoRecording } from 'src/entities';
import { FirebaseStorageService } from 'src/Storage/firebasestorage.service';
import { Repository } from 'typeorm';

@Injectable()
export class VideoRecordingsService {
  constructor(
    @InjectRepository(VideoRecording)
    private readonly videoRecordingRepository: Repository<VideoRecording>,
    private readonly firebaseStorageService: FirebaseStorageService,
  ) {}

  async existsVideoRecordingByFileName(fileName: string) {
    try {
      return await this.videoRecordingRepository.exists({
        where: { filename: fileName, status: true },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async createVideoRecording(
    saveVideoRecordingRequestDto: SaveVideoRecordingRequestDto,
  ) {
    try {
      const filePath = `video/${saveVideoRecordingRequestDto.fileName}`;

      console.log('Subiendo video...');
      await this.firebaseStorageService.uploadFile(
        saveVideoRecordingRequestDto.videoFile,
        filePath,
      );
      const videoRecording = this.videoRecordingRepository.create({
        filename: saveVideoRecordingRequestDto.fileName,
      });

      const savedVideoRecording =
        await this.videoRecordingRepository.save(videoRecording);
      console.log('Subido y almacenado...');
      return savedVideoRecording;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
