import { Module } from '@nestjs/common';
import { RecordingInstitutionService } from './recording-institution.service';
import { RecordingInstitutionController } from './recording-institution.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordingInstitution } from 'src/entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([RecordingInstitution]), AuthModule],
  controllers: [RecordingInstitutionController],
  providers: [RecordingInstitutionService],
  exports: [RecordingInstitutionService],
})
export class RecordingInstitutionModule {}
