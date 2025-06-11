import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { PositionModule } from './position/position.module';
import { JointModule } from './joint/joint.module';
import { RecordingInstitutionModule } from './recording-institution/recording-institution.module';
import { ComparisonModule } from './comparison/comparison.module';
import { FirebaseAdminProvider } from './Storage/firebase.providers';
import { FirebaseStorageService } from './Storage/firebasestorage.service';
import { Bucket } from '@google-cloud/storage';
import { UserModule } from './user/user.module';
const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, DB_LOGGING } = process.env;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_HOST,
      port: parseInt(DB_PORT!, 10),
      username: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      entities: [join(process.cwd(), 'dist/**/*.entity{.ts,.js}')],
      synchronize: true,
      logging: DB_LOGGING === 'true',
    }),
    AuthModule,
    PositionModule,
    JointModule,
    RecordingInstitutionModule,
    ComparisonModule,
    UserModule
  ],
  controllers: [],
  providers: [
    FirebaseAdminProvider,
    {
      provide: 'FIREBASE_BUCKET',
      useFactory: (firebaseAdmin: FirebaseAdminProvider): Bucket => {
        return firebaseAdmin.bucket;
      },
      inject: [FirebaseAdminProvider],
    },
    FirebaseStorageService,
  ],
  exports: ['FIREBASE_BUCKET', FirebaseStorageService],
})
export class AppModule {}
