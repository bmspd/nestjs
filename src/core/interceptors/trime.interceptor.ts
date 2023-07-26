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
export class TrimTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
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
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const body = context.switchToHttp().getRequest().body;
    const trimmedBody = this.trim(body);
    context.switchToHttp().getRequest().body = trimmedBody;
    return next.handle();
  }
}
