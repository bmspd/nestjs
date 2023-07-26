import { IsInt, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { DEFAULT_MAXIMUM_CHAR_LENGTH } from 'src/core/constants/validation';
import { OmitType } from '@nestjs/mapped-types';

export class ProjectDto {
  @IsInt()
  readonly id: number;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(DEFAULT_MAXIMUM_CHAR_LENGTH * 2)
  readonly name: string;
}

export class CreateProjectDto extends OmitType(ProjectDto, ['id']) {}

export class RemoveProjectDto extends OmitType(ProjectDto, ['name']) {}
