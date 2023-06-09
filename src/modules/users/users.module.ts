import { Module } from '@nestjs/common';
import { usersProviders } from './users.provider';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ProfileModule } from './profile/profile.module';

@Module({
  providers: [UsersService, ...usersProviders],
  exports: [UsersService, ...usersProviders],
  controllers: [UsersController],
  imports: [ProfileModule],
})
export class UsersModule {}
