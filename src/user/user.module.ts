import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Position, User } from 'src/entities';
import { UserController } from './user.controller';
import { UserService } from './user.service';


@Module({
    imports: [TypeOrmModule.forFeature([User, Position]), AuthModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
