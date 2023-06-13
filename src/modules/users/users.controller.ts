import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { ProfileService } from './profile/profile.service';

@Controller()
export class UsersController {
  constructor(
    private usersService: UsersService,
    private profileService: ProfileService,
  ) {}
}
