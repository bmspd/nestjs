import { OmitType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { DEFAULT_MAXIMUM_CHAR_LENGTH } from '../../../core/constants/validation';

export class ProfileDto {
  readonly email_verified: boolean;

  @IsOptional()
  @MinLength(2)
  @MaxLength(DEFAULT_MAXIMUM_CHAR_LENGTH)
  @Transform(({ value }) => (!value ? null : value))
  readonly first_name: string;

  @IsOptional()
  @MinLength(2)
  @MaxLength(DEFAULT_MAXIMUM_CHAR_LENGTH)
  @Transform(({ value }) => (!value ? null : value))
  readonly second_name: string;
}

export class CreateUpdateProfileDto extends OmitType(ProfileDto, [
  'email_verified',
]) {}
