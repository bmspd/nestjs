import { Module } from '@nestjs/common';
import { usersProviders } from './users.provider';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [UsersService, ...usersProviders],
  exports: [UsersService, ...usersProviders],
  controllers: [UsersController],
  imports: [ProfileModule, AuthModule],
})
export class UsersModule {}
