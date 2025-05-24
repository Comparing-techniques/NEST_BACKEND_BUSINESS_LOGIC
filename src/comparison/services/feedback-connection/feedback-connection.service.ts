/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { FEEDBACK_PETITION_ERROR } from 'src/utils/FeedbackValidators';

@Injectable()
export class FeedbackConnectionService {
  constructor(private readonly httpService: HttpService) {}

  getFeedbackFromConnection(): Observable<any> {
    try {
      return this.httpService
        .get(process.env.FEEDBACK_URL!)
        .pipe(map((response) => response.data));
    } catch (error) {
      throw new InternalServerErrorException(FEEDBACK_PETITION_ERROR);
    }
  }
}
