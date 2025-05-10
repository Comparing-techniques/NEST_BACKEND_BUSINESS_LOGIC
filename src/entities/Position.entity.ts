import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'positions' })
export class Position {
  @PrimaryGeneratedColumn({ name: 'id_position' })
  id: number;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 30,
    unique: true,
    nullable: false,
  })
  description: string;

  @Column({ name: 'status', type: 'boolean', default: true })
  status: boolean;
}
