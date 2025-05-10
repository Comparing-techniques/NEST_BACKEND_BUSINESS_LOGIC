import { Module } from '@nestjs/common';
import { JointService } from './joint.service';
import { JointController } from './joint.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Joint } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Joint])],
  controllers: [JointController],
  providers: [JointService],
})
export class JointModule {}
