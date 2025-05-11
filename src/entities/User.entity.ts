import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Position } from './Position.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id_user' })
  id: number;

  @Column({
    name: 'identification_number',
    type: 'varchar',
    length: 20,
    nullable: false,
    unique: true,
  })
  identificationNumber: string;

  @Column({ name: 'name', type: 'varchar', length: 20, nullable: false })
  name: string;

  @Column({ name: 'last_name', type: 'varchar', length: 20, nullable: false })
  lastName: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 250, nullable: false })
  password: string;

  @Column({
    name: 'superuser',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  superuser: boolean;

  @Column({ name: 'status', type: 'boolean', default: true, nullable: false })
  status: boolean;

  @ManyToOne(() => Position, { eager: true })
  @JoinColumn({ name: 'id_fk_position' })
  position: Position;
}
