import { Inject, Injectable } from '@nestjs/common';
import { PROJECT_REPOSITORY, TASK_REPOSITORY } from 'src/core/constants';
import { TSeqPagination } from 'src/core/decorators/param/pagination.decorator';
import { AddPagination } from 'src/core/decorators/services/pagination-append.decorator';
import { Project } from 'src/core/entities/project.entity';
import { Task } from 'src/core/entities/task.entity';
import { User } from 'src/core/entities/user.entity';
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

  @AddPagination
  async getAllTasks({
    projectId,
    pagination,
  }: {
    projectId: number;
    pagination: TSeqPagination;
  }) {
    const currentProject = await this.projectService.getProjectById(projectId);
    // TODO: need to reorganize this, to avoid assigning params to pagination arg
    const total = await currentProject.countTasks();
    pagination.total = total;
    return await currentProject.getTasks({
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'executor', attributes: ['id', 'username'] },
        { model: Project, as: 'project', attributes: ['name', 'id'] },
      ],
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['project_id', 'executor_id', 'creator_id'] },
      ...pagination,
    });
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
    return await this.taskRepository.findByPk(taskId, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'executor', attributes: ['id', 'username'] },
      ],
    });
  }
  async deleteTask(taskId: number) {
    const deletingTask = await this.getTaskById(taskId);
    await deletingTask.destroy();
  }
}
