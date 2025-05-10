import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'joints' })
export class Joint {
  @PrimaryGeneratedColumn({ name: 'id_joint' })
  id: number;

  @Column({
    name: 'jointname',
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  jointName: string;

  @Column({ name: 'status', type: 'boolean', default: true })
  status: boolean;
}
