import { Module } from '@nestjs/common';
import { JointService } from './joint.service';
import { JointController } from './joint.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Joint } from 'src/entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Joint]), AuthModule],
  controllers: [JointController],
  providers: [JointService],
  exports: [JointService],
})
export class JointModule {}
