import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { webcrypto } from 'crypto';

@Injectable()
export class SignupPipe implements PipeTransform {
  constructor(private readonly userService: UsersService) {}
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (value.username) return value;
    const count = (await this.userService.countAll()) + 1;
    const username = await this.createUniqueUsername(`user-${count}`);
    return { ...value, username };
  }
  async createUniqueUsername(username: string) {
    const user = await this.userService.findOneByUsername(username);
    if (!user) return username;

    const array = new Uint32Array(1);
    webcrypto.getRandomValues(array);
    const [number] = array;
    return this.createUniqueUsername(`user-${number}`);
  }
}
