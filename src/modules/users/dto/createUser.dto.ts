import { IntersectionType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';
import { ProfileDto } from './profile.dto';

export class CreateUserDto extends IntersectionType(UserDto, ProfileDto) {}
