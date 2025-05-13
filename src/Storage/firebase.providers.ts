/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import { Bucket } from '@google-cloud/storage';

@Injectable()
export class FirebaseAdminProvider {
  private readonly firebaseApp: admin.app.App;
  private readonly firebaseBucket: Bucket;

  constructor(private readonly configService: ConfigService) {
    const credentialsPath = this.configService.get<string>(
      'FIREBASE_CREDENTIALS',
    );
    if (!credentialsPath) {
      throw new Error('FIREBASE_CREDENTIALS env variable is not defined');
    }

    const absolutePath = path.resolve(credentialsPath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(
        `Firebase credentials file not found at: ${absolutePath}`,
      );
    }

    const serviceAccount = require(absolutePath);

    // 🛠️ Verifica que tengas configurado correctamente el bucket
    const storageBucket =
      serviceAccount.storageBucket ||
      this.configService.get<string>('FIREBASE_STORAGE');

    if (!storageBucket) {
      throw new Error(
        'No se encontró el storageBucket ni en el JSON ni en la variable de entorno FIREBASE_STORAGE',
      );
    }

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket,
    });

    this.firebaseBucket = admin.storage().bucket();
  }

  get app(): admin.app.App {
    return this.firebaseApp;
  }

  get bucket(): Bucket {
    return this.firebaseBucket;
  }
}
