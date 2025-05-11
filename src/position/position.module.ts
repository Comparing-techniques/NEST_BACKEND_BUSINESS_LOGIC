import { Module } from '@nestjs/common';
import { PositionService } from './position.service';
import { PositionController } from './position.controller';
import { Position } from '../entities/Position.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Position]), AuthModule],
  controllers: [PositionController],
  providers: [PositionService],
})
export class PositionModule {}
