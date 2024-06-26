import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/0')
  geZero() {
    return { zero: 0 };
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/1')
  getOne() {
    return { message: 'got-one' };
  }
}
