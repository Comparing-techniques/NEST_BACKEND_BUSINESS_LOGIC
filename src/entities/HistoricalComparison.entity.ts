import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseMovement } from './BaseMovement.entity';
import { ComparativeMovement } from './ComparativeMovement.entity';

@Entity({ name: 'historical_comparisons' })
export class HistoricalComparison {
  @PrimaryGeneratedColumn({ name: 'id_historical_comparisons' })
  id: number;

  @Column({ name: 'datetime', type: 'timestamp' })
  dateTime: Date;

  @Column({ name: 'status', type: 'boolean', default: true, nullable: false })
  status: boolean;

  @ManyToOne(() => BaseMovement, { eager: true })
  @JoinColumn({ name: 'id_fk_base_movement' })
  baseMovement: BaseMovement;

  @ManyToOne(() => ComparativeMovement, { eager: true })
  @JoinColumn({ name: 'id_fk_comparative_movement' })
  comparativeMovement: ComparativeMovement;
}
