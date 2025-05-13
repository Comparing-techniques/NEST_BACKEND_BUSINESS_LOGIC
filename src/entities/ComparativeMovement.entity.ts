import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExcelFile } from './ExcelFile.entity';

@Entity({ name: 'comparative_movements' })
export class ComparativeMovement {
  @PrimaryGeneratedColumn({ name: 'id_comparative_movement' })
  id: number;

  @Column({ name: 'status', type: 'boolean', default: true, nullable: false })
  status: boolean;

  @ManyToOne(() => ExcelFile, { eager: true })
  @JoinColumn({ name: 'id_fk_excel_file' })
  excelFile: ExcelFile;
}
