import { NotFoundException } from '@nestjs/common/exceptions';
import { createErrorBody } from './utils';

export class CustomNotFoundException extends NotFoundException {
  constructor(errorObj: Record<string, string>) {
    super(createErrorBody(errorObj));
  }
}
