import { BadRequestException, ValidationError } from '@nestjs/common';

export const createErrorBody = (errorObj: Record<string, string>) => {
  return { errors: errorObj };
};

// todo make it real for nested errors
export const exceptionFactory = (errors: ValidationError[]) => {
  const errorMessages = {};
  errors.forEach((error) => {
    errorMessages[error.property] = Object.values(error.constraints);
  });
  return new BadRequestException({ errors: errorMessages });
};
