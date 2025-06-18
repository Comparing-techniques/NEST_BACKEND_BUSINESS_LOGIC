import { forwardRef, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ComparisonService } from './comparison.service';
import { ComparisonController } from './comparison.controller';
import { AuthModule } from 'src/auth/auth.module';
import { VideoRecordingsService } from './services/video-recordings/video-recordings.service';
import { HistoricalComparisonsService } from './services/historical-comparisons/historical-comparisons.service';
import { ExcelFilesService } from './services/excel-files/excel-files.service';
import { BaseMovementsService } from './services/base-movements/base-movements.service';
import { JointModule } from 'src/joint/joint.module';
import { RecordingInstitutionModule } from 'src/recording-institution/recording-institution.module';
import {
  BaseMovement,
  ComparativeMovement,
  ExcelFile,
  HistoricalComparison,
  VideoRecording,
} from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { FeedbackConnectionService } from './services/feedback-connection/feedback-connection.service';
import { ComparativeMovementsService } from './services/comparative-movements/comparative-movements.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExcelFile,
      VideoRecording,
      BaseMovement,
      HistoricalComparison,
      ComparativeMovement,
    ]),
    AuthModule,
    HttpModule,
    RecordingInstitutionModule,
    JointModule,
    forwardRef(() => AppModule),
  ],
  controllers: [ComparisonController],
  providers: [
    ComparisonService,
    VideoRecordingsService,
    HistoricalComparisonsService,
    ExcelFilesService,
    BaseMovementsService,
    FeedbackConnectionService,
    ComparativeMovementsService,
    HistoricalComparisonsService,
  ],
  exports: [HistoricalComparisonsService],
})
export class ComparisonModule {}
