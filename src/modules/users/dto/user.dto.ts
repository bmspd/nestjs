import { PickType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  DEFAULT_MAXIMUM_CHAR_LENGTH,
  DEFAULT_MINIMUM_CHAR_LENGTH,
  MINIMUM_PASSWORD_LENGTH,
} from '../../../core/constants/validation';

export class UserDto {
  @IsOptional()
  @MinLength(DEFAULT_MINIMUM_CHAR_LENGTH)
  @MaxLength(DEFAULT_MAXIMUM_CHAR_LENGTH)
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(MINIMUM_PASSWORD_LENGTH)
  @MaxLength(DEFAULT_MAXIMUM_CHAR_LENGTH)
  readonly password: string;
}

export class CreateUserPassDto extends PickType(UserDto, ['password']) {}
export class UpdateUserPassDto extends CreateUserPassDto {
  @IsNotEmpty()
  @MinLength(MINIMUM_PASSWORD_LENGTH)
  @MaxLength(DEFAULT_MAXIMUM_CHAR_LENGTH)
  readonly new_password: string;
}
