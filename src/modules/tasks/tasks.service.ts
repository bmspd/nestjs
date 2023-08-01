import { Inject, Injectable } from '@nestjs/common';
import { PROJECT_REPOSITORY, TASK_REPOSITORY } from 'src/core/constants';
import { Project } from 'src/core/entities/project.entity';
import { Task } from 'src/core/entities/task.entity';
import { ProjectsService } from '../projects/projects.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly taskRepository: typeof Task,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: typeof Project,
    @Inject(ProjectsService) private readonly projectService: ProjectsService,
  ) {}

  async getAllTasks(projectId: number) {
    const currentProject = await this.projectService.getProjectById(projectId);
    return await currentProject.getTasks();
  }

  async createTask(projectId: number, userId: number, task: CreateTaskDto) {
    const currentProject = await this.projectService.getProjectById(projectId);
    const newTask = await currentProject.createTask({
      ...task,
      creator_id: userId,
    });
    return newTask;
  }
  async updateTask(taskId: number, task: UpdateTaskDto) {
    const updatingTask = await this.getTaskById(taskId);
    return await updatingTask.update(task);
  }

  async getTaskById(taskId: number) {
    return await this.taskRepository.findByPk(taskId);
  }
  async deleteTask(taskId: number) {
    const deletingTask = await this.getTaskById(taskId);
    await deletingTask.destroy();
  }
}
