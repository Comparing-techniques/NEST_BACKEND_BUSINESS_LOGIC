import { Module } from '@nestjs/common';
import { RecordingInstitutionService } from './recording-institution.service';
import { RecordingInstitutionController } from './recording-institution.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordingInstitution } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([RecordingInstitution])],
  controllers: [RecordingInstitutionController],
  providers: [RecordingInstitutionService],
})
export class RecordingInstitutionModule {}
