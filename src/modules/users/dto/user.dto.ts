import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  @IsOptional()
  @MinLength(4)
  readonly nickname?: string;
}
