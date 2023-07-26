import { IntersectionType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';
import { CreateUpdateProfileDto } from './profile.dto';

export class CreateUserDto extends IntersectionType(
  UserDto,
  CreateUpdateProfileDto,
) {}
