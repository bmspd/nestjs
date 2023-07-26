import { OmitType } from '@nestjs/mapped-types';
import { IsOptional, MaxLength, MinLength } from 'class-validator';
import {
  DEFAULT_MAXIMUM_CHAR_LENGTH,
  DEFAULT_MINIMUM_CHAR_LENGTH,
} from '../../../core/constants/validation';

export class ProfileDto {
  readonly email_verified: boolean;

  @IsOptional()
  @MinLength(DEFAULT_MINIMUM_CHAR_LENGTH)
  @MaxLength(DEFAULT_MAXIMUM_CHAR_LENGTH)
  readonly first_name: string;

  @IsOptional()
  @MinLength(DEFAULT_MINIMUM_CHAR_LENGTH)
  @MaxLength(DEFAULT_MAXIMUM_CHAR_LENGTH)
  readonly second_name: string;
}

export class CreateUpdateProfileDto extends OmitType(ProfileDto, [
  'email_verified',
]) {}
