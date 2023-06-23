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

export class ProfileDto {
  @IsOptional()
  @MinLength(DEFAULT_MINIMUM_CHAR_LENGTH)
  @MaxLength(DEFAULT_MAXIMUM_CHAR_LENGTH)
  readonly first_name: string;

  @IsOptional()
  @MinLength(DEFAULT_MINIMUM_CHAR_LENGTH)
  @MaxLength(DEFAULT_MAXIMUM_CHAR_LENGTH)
  readonly second_name: string;
}
