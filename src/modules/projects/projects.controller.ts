import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Get,
  Res,
  ParseFilePipe,
  HttpStatus,
  StreamableFile,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import {
  Pagination,
  TSeqPagination,
} from 'src/core/decorators/param/pagination.decorator';
import { CustomBadRequestExceptions } from 'src/core/exceptions/CustomBadRequestExceptions';
import { IsProjectExists } from 'src/core/guards/IsProjectExists.guard';
import { IsUserInProject } from 'src/core/guards/isUserInProject.guard';
import { TrimTransformInterceptor } from 'src/core/interceptors/trim.interceptor';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { ProjectsService } from './projects.service';
import { UploadService } from '../upload/upload.service';
import { InviteUserToProjectDto } from '../users/dto/user.dto';

@Controller()
export class ProjectsController {
  constructor(
    private projectService: ProjectsService,
    private uploadService: UploadService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/all')
  async getAllProject() {
    return await this.projectService.getAllProject();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/personal')
  async getPersonalProjects(@Request() req) {
    return await this.projectService.getPersonalProjects(req.user);
  }

  @UseGuards(AuthGuard('jwt'), IsProjectExists, IsUserInProject)
  @Get(':projectId/users')
  async getUsersInProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Pagination() pagination: TSeqPagination,
  ) {
    return await this.projectService.getUsersInProject({
      projectId,
      pagination,
    });
  }
  @UseGuards(AuthGuard('jwt'), IsProjectExists, IsUserInProject)
  @Get(':projectId')
  async getProjectById(@Param('projectId', ParseIntPipe) projectId: number) {
    return await this.projectService.getProjectInfo(projectId);
  }
  // TODO: limit on image size
  // @UseGuards(AuthGuard('jwt'), IsProjectExists, IsUserInProject)
  @Get(':projectId/logo')
  async getProjectLogo(
    @Res({ passthrough: true }) res: Response,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    const file = await this.projectService.getLogo(projectId);
    if (!file) {
      res.status(HttpStatus.NO_CONTENT);
      return;
    }
    res.set({
      'Content-Type': `${file.mimetype};charset=UTF-8`,
    });
    console.log(file);
    return new StreamableFile(file.file);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new TrimTransformInterceptor(), FileInterceptor('image'))
  @Post()
  async createProject(
    @Request() req,
    @Body() project: CreateProjectDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        exceptionFactory: (error) => {
          return new CustomBadRequestExceptions({ image: error });
        },
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.projectService.create(project, req.user, file);
  }

  @UseGuards(AuthGuard('jwt'), IsProjectExists, IsUserInProject)
  @Post(':projectId/logo')
  @UseInterceptors(FileInterceptor('logo'))
  async uploadProjectLogo(
    @Param('projectId', ParseIntPipe) projectId: number,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        exceptionFactory: (error) => {
          return new CustomBadRequestExceptions({ image: error });
        },
      }),
    )
    logo: Express.Multer.File,
  ) {
    await this.projectService.updateLogo(projectId, logo);
    return {
      message: 'Project logo was successfully updated',
    };
  }

  @UseGuards(AuthGuard('jwt'), IsProjectExists, IsUserInProject)
  @Patch(':projectId')
  @UseInterceptors(FileInterceptor('image'))
  @UseInterceptors(new TrimTransformInterceptor())
  async updateProjectInfo(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() project: UpdateProjectDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        exceptionFactory: (error) => {
          return new CustomBadRequestExceptions({ image: error });
        },
      }),
    )
    logo: Express.Multer.File,
  ) {
    if (project.same_logo !== true)
      await this.projectService.updateLogo(projectId, logo);
    return await this.projectService.updateProjectInfo(projectId, project);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':projectId/quit')
  async leaveProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Request() req,
  ) {
    await this.projectService.removeProject(projectId, req.user);
    return {
      message: 'Project was successfully left',
    };
  }

  // TODO: сделать удаление по правам каким-нибудь
  @UseGuards(AuthGuard('jwt'))
  @Delete(':projectId')
  async deleteProject(@Param('projectId', ParseIntPipe) projectId: number) {
    await this.projectService.deleteProject(projectId);
    return {
      message: 'Project was successfully deleted',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':projectId/add')
  async addProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Request() req,
  ) {
    await this.projectService.addProject(projectId, req.user);
    return {
      message: 'Project was successfully added',
    };
  }

  @UseGuards(AuthGuard('jwt'), IsProjectExists, IsUserInProject)
  @Patch(':projectId/invite')
  async inviteUserToProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: InviteUserToProjectDto,
  ) {
    await this.projectService.inviteUserToProject(projectId, body.email);
    return {
      user: 'Successfully added user to project',
    };
  }
}
