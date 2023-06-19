import { ForbiddenException } from '@nestjs/common';
import { createErrorBody } from './utils';

export class CustomForbiddenException extends ForbiddenException {
  constructor(errorObj: Record<string, string>) {
    super(createErrorBody(errorObj));
  }
}
