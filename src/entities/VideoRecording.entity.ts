import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'video_recordings' })
export class VideoRecording {
  @PrimaryGeneratedColumn({ name: 'id_video_recording' })
  id: number;

  @Column({
    name: 'filename',
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  filename: string;

  @Column({ name: 'fileurl', type: 'varchar', length: 300, nullable: false })
  fileUrl: string;

  @Column({ name: 'status', type: 'boolean', default: true })
  status: boolean;
}
