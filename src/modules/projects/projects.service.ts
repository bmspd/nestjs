import { Inject, Injectable } from '@nestjs/common';
import { PROJECT_REPOSITORY, USER_REPOSITORY } from 'src/core/constants';
import { CustomBadRequestExceptions } from 'src/core/exceptions/CustomBadRequestExceptions';
import { User } from '../../core/entities/user.entity';
import { CreateProjectDto } from './dto/project.dto';
import { Project } from '../../core/entities/project.entity';
import { AddPagination } from 'src/core/decorators/services/pagination-append.decorator';
import { TSeqPagination } from 'src/core/decorators/param/pagination.decorator';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: typeof Project,
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async create(
    project: CreateProjectDto,
    user: { id: string },
  ): Promise<Project> {
    const dbUser = await this.userRepository.findByPk(user.id);
    const newProject = await dbUser.createProject(project);
    return newProject;
  }

  @AddPagination
  async getUsersInProject({
    projectId,
    pagination,
  }: {
    projectId: number;
    pagination: TSeqPagination;
  }) {
    const currentProject = await this.projectRepository.findByPk(projectId);
    const total = await currentProject.countUsers();
    pagination.total = total;
    return currentProject.getUsers({
      joinTableAttributes: [],
      attributes: ['id', 'email', 'username'],
      ...pagination,
    });
  }

  async removeProject(projectId: number, user: { id: string }): Promise<void> {
    const dbUser = await this.userRepository.findByPk(user.id);
    const isProjectExsist = await dbUser.hasProject(projectId);
    if (!isProjectExsist)
      throw new CustomBadRequestExceptions({ project: 'Project not found' });
    await dbUser.removeProject(projectId);
  }

  async deleteProject(project_id: number): Promise<void> {
    const dbProject = await this.projectRepository.findByPk(project_id);
    if (!dbProject)
      throw new CustomBadRequestExceptions({ project: 'Project not found' });
    await dbProject.destroy();
  }

  async addProject(projectId: number, user: { id: string }): Promise<void> {
    const dbProject = await this.projectRepository.findByPk(projectId);
    if (!dbProject)
      throw new CustomBadRequestExceptions({ project: 'Project not found' });
    const dbUser = await this.userRepository.findByPk(user.id);
    await dbUser.addProject(projectId);
  }

  async getPersonalProjects(user: { id: string }): Promise<Project[]> {
    const dbUser = await this.userRepository.findByPk(user.id);
    return await dbUser.getProjects({ joinTableAttributes: [] });
  }
  async getProjectById(projectId: number) {
    return await this.projectRepository.findByPk(projectId);
  }

  async getAllProject(): Promise<Project[]> {
    return await this.projectRepository.findAll();
  }
}
