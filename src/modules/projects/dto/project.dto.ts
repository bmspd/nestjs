import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DEFAULT_MAXIMUM_CHAR_LENGTH } from 'src/core/constants/validation';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  PROJECT_PATTERN_COLORS,
  PROJECT_PATTERN_TYPES,
} from 'src/core/constants/project';
import { Transform } from 'class-transformer';

export class ProjectDto {
  @IsInt()
  readonly id: number;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(DEFAULT_MAXIMUM_CHAR_LENGTH * 2)
  readonly name: string;

  @IsOptional()
  @IsEnum(PROJECT_PATTERN_TYPES)
  readonly pattern_type: PROJECT_PATTERN_TYPES;

  @IsOptional()
  @IsEnum(PROJECT_PATTERN_COLORS)
  readonly pattern_color: PROJECT_PATTERN_COLORS;
}

export class CreateProjectDto extends OmitType(ProjectDto, ['id']) {}

export class RemoveProjectDto extends OmitType(ProjectDto, ['name']) {}

export class UpdateProjectDto extends PartialType(
  OmitType(ProjectDto, ['id']),
) {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  readonly same_logo: boolean;
}
