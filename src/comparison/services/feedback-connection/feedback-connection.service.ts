/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import * as FormData from 'form-data';
import { FEEDBACK_PETITION_ERROR } from 'src/utils/FeedbackValidators';

@Injectable()
export class FeedbackConnectionService {

  constructor( private readonly httpService: HttpService ) {}

  async sendFeedbackRequest(
    baseExcelFile: Partial<Express.Multer.File>,
    excelFileCompare: Express.Multer.File,
    jointId: number,
  ): Promise<any> {
    try {
      const formData = new FormData();
      
      if ( !baseExcelFile.buffer || !baseExcelFile.originalname || !baseExcelFile.mimetype ) {
        throw new InternalServerErrorException(
          'Faltan datos en baseExcelFile para enviar al backend de feedback.',
        );
      }

      if ( !excelFileCompare.buffer || !excelFileCompare.originalname || !excelFileCompare.mimetype ) {
        throw new InternalServerErrorException(
          'Faltan datos en excelFileCompare para enviar al backend de feedback.',
        );
      }

      formData.append('base_excel_file', baseExcelFile.buffer, {
        filename: baseExcelFile.originalname,
        contentType: baseExcelFile.mimetype,
      });

      formData.append('excel_file_compare', excelFileCompare.buffer, {
        filename: excelFileCompare.originalname,
        contentType: excelFileCompare.mimetype,
      });

      formData.append('joint_id', jointId.toString());

      const headers = formData.getHeaders();

      const response$ = this.httpService.post(
        `${process.env.FEEDBACK_URL}`, // o el path correcto
        formData,
        { headers },
      ).pipe(map(res => res.data));

      return await lastValueFrom(response$);

    } catch (error) {
      throw new InternalServerErrorException(FEEDBACK_PETITION_ERROR);
    }
  }

}
