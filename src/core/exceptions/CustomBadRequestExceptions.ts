import { BadRequestException } from '@nestjs/common';
import { createErrorBody } from './utils';

export class CustomBadRequestExceptions extends BadRequestException {
  constructor(errorObj: Record<string, string>) {
    super(createErrorBody(errorObj));
  }
}
