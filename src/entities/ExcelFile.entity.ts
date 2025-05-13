// src/entities/excel-file.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User.entity';
import { RecordingInstitution } from './RecordingInstitution.entity';

@Entity({ name: 'excel_files' })
export class ExcelFile {
  @PrimaryGeneratedColumn({ name: 'id_excel_file' })
  id: number;

  @Column({
    name: 'filename',
    type: 'varchar',
    length: 200,
    nullable: false,
    unique: true,
  })
  filename: string;

  @Column({ name: 'status', type: 'boolean', default: true, nullable: false })
  status: boolean;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'id_fk_user_uploader' })
  uploader: User;

  @ManyToOne(() => RecordingInstitution, { eager: true })
  @JoinColumn({ name: 'id_fk_recording_institution' })
  recordingInstitution: RecordingInstitution;
}
