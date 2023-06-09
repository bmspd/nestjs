import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class SignupPipe implements PipeTransform {
  constructor(private readonly userService: UsersService) {}
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (value.username) return value;
    // возможно, лучше опереться на рандомную генерацию числа
    const count = (await this.userService.countAll()) + 1;
    return { ...value, username: `user-${count}` };
  }
}
