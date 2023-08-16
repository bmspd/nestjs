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
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  Pagination,
  TSeqPagination,
} from 'src/core/decorators/param/pagination.decorator';
import { IsProjectExists } from 'src/core/guards/IsProjectExists.guard';
import { IsUserInProject } from 'src/core/guards/isUserInProject.guard';
import { TrimTransformInterceptor } from 'src/core/interceptors/trim.interceptor';
import { CreateProjectDto } from './dto/project.dto';
import { ProjectsService } from './projects.service';

@Controller()
export class ProjectsController {
  constructor(private projectService: ProjectsService) {}

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

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new TrimTransformInterceptor())
  @Post()
  async createProject(@Request() req, @Body() project: CreateProjectDto) {
    return await this.projectService.create(project, req.user);
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
}
