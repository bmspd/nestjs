import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { isObject } from 'lodash';
import { Observable } from 'rxjs';
export interface Response<T> {
  data: T;
}

@Injectable()
export class NullFormDataReaderInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  private blackList: string[] | undefined;
  constructor(blackList?: string[]) {
    this.blackList = blackList;
  }
  private nullTransform(values) {
    Object.keys(values).forEach((key) => {
      if (
        !this.blackList ||
        (this.blackList && !this.blackList.includes(key))
      ) {
        if (isObject(values[key])) {
          values[key] = this.nullTransform(values[key]);
        } else {
          if (typeof values[key] === 'string' && values[key] === '') {
            values[key] = null;
          }
        }
      }
    });
    return values;
  }
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // сделано так, потому что в multipart/formdata приходит null prototype object
    const body = Object.assign({}, context.switchToHttp().getRequest().body);
    const trimmedBody = this.nullTransform(body);
    context.switchToHttp().getRequest().body = trimmedBody;
    console.log(trimmedBody);
    return next.handle();
  }
}
