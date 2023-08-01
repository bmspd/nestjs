import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsProjectExists } from 'src/core/guards/IsProjectExists.guard';
import { IsTaskExists } from 'src/core/guards/IsTaskExists.guard';
import { IsUserInProject } from 'src/core/guards/isUserInProject.guard';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { TasksService } from './tasks.service';

@UseGuards(AuthGuard('jwt'), IsProjectExists, IsUserInProject)
@Controller()
export class TasksController {
  constructor(private tasksService: TasksService) {}
  @Get()
  async getAllTasks(@Param('projectId', ParseIntPipe) projectId: number) {
    return await this.tasksService.getAllTasks(projectId);
  }
  @Post()
  async createTask(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Request() req,
    @Body() task: CreateTaskDto,
  ) {
    const userId = req.user.id;
    return await this.tasksService.createTask(projectId, userId, task);
  }

  @UseGuards(IsTaskExists)
  @Get(':taskId')
  async getTaskById(@Param('taskId', ParseIntPipe) taskId: number) {
    return await this.tasksService.getTaskById(taskId);
  }

  @UseGuards(IsTaskExists)
  @Patch(':taskId')
  async updateTask(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() task: UpdateTaskDto,
  ) {
    return await this.tasksService.updateTask(taskId, task);
  }

  @UseGuards(IsTaskExists)
  @Delete(':taskId')
  async deleteTask(@Param('taskId', ParseIntPipe) taskId: number) {
    await this.tasksService.deleteTask(taskId);
    return {
      message: 'Task successfully deleted',
    };
  }
}
