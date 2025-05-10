import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateRecordingInstitutionDto } from './dto/create-recording-institution.dto';
import { UpdateRecordingInstitutionDto } from './dto/update-recording-institution.dto';
import { RecordingInstitution } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  RecordingInstitutionEntitieToRecordingInstitutionResponseDto,
  RecordingInstitutionEntitieToRecordingInstitutionResponseDtoList,
} from 'src/mappers/RecordingInstitution.mapper';
import { alreadyExists, notFoundById } from 'src/utils/DtoValidators';

@Injectable()
export class RecordingInstitutionService {
  constructor(
    @InjectRepository(RecordingInstitution)
    private readonly recordingInstitutionRepository: Repository<RecordingInstitution>,
  ) {}

  async create(createRecordingInstitutionDto: CreateRecordingInstitutionDto) {
    try {
      const recordingInstitution = this.recordingInstitutionRepository.create(
        createRecordingInstitutionDto,
      );

      return RecordingInstitutionEntitieToRecordingInstitutionResponseDto(
        await this.recordingInstitutionRepository.save(recordingInstitution),
      );
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code && error.code === '23505')
        throw new BadRequestException(
          alreadyExists(
            createRecordingInstitutionDto.description,
            'description',
            'RecordingInstitution',
          ),
        );
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try {
      const recordingInstitution =
        await this.recordingInstitutionRepository.find({
          where: { status: true },
        });

      if (recordingInstitution && recordingInstitution.length > 0)
        return RecordingInstitutionEntitieToRecordingInstitutionResponseDtoList(
          recordingInstitution,
        );

      return [];
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: number) {
    try {
      const recordingInstitution =
        await this.recordingInstitutionRepository.findOne({
          where: { id, status: true },
        });

      if (!recordingInstitution)
        throw new BadRequestException(notFoundById(id, 'RecordingInstitution'));

      return RecordingInstitutionEntitieToRecordingInstitutionResponseDto(
        recordingInstitution,
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    id: number,
    updateRecordingInstitutionDto: UpdateRecordingInstitutionDto,
  ) {
    try {
      const originalRecordingInstitution =
        await this.recordingInstitutionRepository.findOneBy({ id });
      if (!originalRecordingInstitution)
        throw new BadRequestException(notFoundById(id, 'RecordingInstitution'));

      const updateResult = await this.recordingInstitutionRepository.update(
        id,
        updateRecordingInstitutionDto,
      );

      if (updateResult.affected === 0)
        return RecordingInstitutionEntitieToRecordingInstitutionResponseDto(
          originalRecordingInstitution,
        );

      const updated = await this.recordingInstitutionRepository.findOneBy({
        id,
      });
      if (updated)
        return RecordingInstitutionEntitieToRecordingInstitutionResponseDto(
          updated,
        );
      return [];
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code && error.code === '23505')
        throw new BadRequestException(
          alreadyExists(
            updateRecordingInstitutionDto.description,
            'description',
            'RecordingInstitution',
          ),
        );
      throw new BadRequestException(error);
    }
  }

  async remove(id: number) {
    try {
      const result = await this.recordingInstitutionRepository.delete({ id });

      if (result.affected === 0)
        throw new BadRequestException(notFoundById(id, 'RecordingInstitution'));
      return { message: 'RecordingInstitution deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
