import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { UsersService } from './modules/users/users.service';
import { AuthModule } from './modules/auth/auth.module';
import { MailingModule } from './modules/mailing/mailing.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ProfileModule } from './modules/users/profile/profile.module';
import { RouterModule } from '@nestjs/core';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      template: {
        dir: process.cwd() + '/src/core/templates',
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
    DatabaseModule,
    AuthModule,
    MailingModule,
    UsersModule,
    ProfileModule,
    RouterModule.register([
      {
        path: 'user',
        module: UsersModule,
        children: [
          {
            path: 'profile',
            module: ProfileModule,
          },
        ],
      },
      {
        path: 'projects',
        module: ProjectsModule,
        children: [
          {
            path: ':projectId/tasks',
            module: TasksModule,
          },
        ],
      },
    ]),
    ProjectsModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersService],
})
export class AppModule {}
