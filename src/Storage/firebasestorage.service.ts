/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Bucket } from '@google-cloud/storage';

@Injectable()
export class FirebaseStorageService {
  constructor(@Inject('FIREBASE_BUCKET') private readonly bucket: Bucket) {}

  async uploadFile(file: Express.Multer.File, folder = ''): Promise<string> {
    const filename = `${folder}/${file.originalname}`;
    const fileUpload = this.bucket.file(filename);

    try {
      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      await fileUpload.makePublic();
      const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${filename}`;
      return publicUrl;
    } catch (err) {
      throw new InternalServerErrorException(
        'Error uploading or publishing file to Firebase: ' + err.message,
      );
    }
  }

  async downloadFileToBuffer(filePath: string): Promise<Buffer> {
    const file = this.bucket.file(filePath);

    try {
      const [exists] = await file.exists();
      if (!exists) {
        throw new Error(`El archivo ${filePath} no existe en Firebase.`);
      }

      const [contents] = await file.download();
      return contents;
    } catch (err) {
      throw new InternalServerErrorException(
        'Error al descargar archivo de Firebase: ' + err.message,
      );
    }
  }

}
