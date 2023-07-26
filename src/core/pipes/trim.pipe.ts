import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isObject } from 'lodash';
import { CustomBadRequestExceptions } from '../exceptions/CustomBadRequestExceptions';

@Injectable()
export class TrimPipe implements PipeTransform {
  private blackList: string[] | undefined;
  constructor(blackList?: string[]) {
    this.blackList = blackList;
  }
  private trim(values) {
    Object.keys(values).forEach((key) => {
      if (
        !this.blackList ||
        (this.blackList && !this.blackList.includes(key))
      ) {
        if (isObject(values[key])) {
          values[key] = this.trim(values[key]);
        } else {
          if (typeof values[key] === 'string') {
            values[key] = values[key].trim();
          }
        }
      }
    });
    return values;
  }
  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    console.log(type);
    if (isObject(value) && type === 'body') {
      return this.trim(value);
    }

    throw new CustomBadRequestExceptions({
      validation: 'Validation failed',
    });
  }
}
