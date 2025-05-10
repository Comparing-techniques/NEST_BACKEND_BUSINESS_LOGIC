import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'recording_institution' })
export class RecordingInstitution {
  @PrimaryGeneratedColumn({ name: 'id_recording_institution' })
  id: number;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 200,
    nullable: false,
    unique: true,
  })
  description: string;

  @Column({ name: 'status', type: 'boolean', default: true, nullable: false })
  status: boolean;
}
