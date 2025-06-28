import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExcelFile } from './ExcelFile.entity';
import { Joint } from './Joint.entity';
import { VideoRecording } from './VideoRecording.entity';

@Entity({ name: 'base_movements' })
export class BaseMovement {
  @PrimaryGeneratedColumn({ name: 'id_base_movement' })
  id: number;

  @Column({ name: 'status', type: 'boolean', default: true, nullable: false })
  status: boolean;

  @ManyToOne(() => ExcelFile, { eager: true })
  @JoinColumn({ name: 'id_fk_excel_file' })
  excelFile: ExcelFile;

  @ManyToOne(() => Joint, { eager: true })
  @JoinColumn({ name: 'id_fk_initial_joint' })
  initialJoint: Joint;

  @ManyToOne(() => VideoRecording, { eager: true })
  @JoinColumn({ name: 'id_fk_video_recording' })
  videoRecording: VideoRecording;
}