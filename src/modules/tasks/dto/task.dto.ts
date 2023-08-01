import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';
import { TASK_PRIORITIES, TASK_STATUSES } from 'src/core/constants/task';
import { DEFAULT_MINIMUM_CHAR_LENGTH } from 'src/core/constants/validation';

export class TaskDto {
  @IsInt()
  readonly project_id: number;

  @IsOptional()
  @IsInt()
  readonly executor_id: number;

  @IsInt()
  readonly creator_id: number;

  @IsString()
  @MinLength(DEFAULT_MINIMUM_CHAR_LENGTH)
  readonly title: string;

  @IsOptional()
  @IsString()
  @MinLength(DEFAULT_MINIMUM_CHAR_LENGTH)
  readonly description: string;

  @IsString()
  @IsEnum(TASK_STATUSES)
  readonly status: TASK_STATUSES;

  @IsString()
  @IsEnum(TASK_PRIORITIES)
  readonly priority: TASK_PRIORITIES;
}

export class CreateTaskDto extends OmitType(TaskDto, [
  'project_id',
  'creator_id',
]) {}
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
