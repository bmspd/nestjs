import { Inject, Injectable } from '@nestjs/common';
import { PROJECT_REPOSITORY, USER_REPOSITORY } from 'src/core/constants';
import { CustomBadRequestExceptions } from 'src/core/exceptions/CustomBadRequestExceptions';
import { User } from '../../core/entities/user.entity';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { Project } from '../../core/entities/project.entity';
import { AddPagination } from 'src/core/decorators/services/pagination-append.decorator';
import { TSeqPagination } from 'src/core/decorators/param/pagination.decorator';
import { UploadService } from '../upload/upload.service';
import { Image } from '../../core/entities/image.entity';
import { ReadStream } from 'fs';
import { FindAttributeOptions, Includeable } from 'sequelize';
@Injectable()
export class ProjectsService {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: typeof Project,
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    @Inject(UploadService) private readonly uploadService: UploadService,
  ) {}

  async create(
    project: CreateProjectDto,
    user: { id: string },
    file?: Express.Multer.File,
  ): Promise<Project> {
    const dbUser = await this.userRepository.findByPk(user.id);
    const newProject = await dbUser.createProject({
      ...project,
      creator_id: +user.id,
    });
    if (file) {
      const path = await this.uploadService.saveImageToSystem(
        file,
        'uploads/projects',
      );
      await newProject.createLogo({
        original_name: file.originalname,
        mimetype: file.mimetype,
        path,
      });
    }
    return newProject;
  }
  async updateProjectInfo(projectId: number, projectInfo: UpdateProjectDto) {
    const project = await this.getProjectById(projectId, {
      include: [{ model: Image, as: 'logo' }],
      atttribtutes: { exclude: ['logo_id'] },
    });
    return await project.update(projectInfo);
  }
  async updateLogo(projectId: number, logo?: Express.Multer.File) {
    const project = await this.getProjectById(projectId);
    const oldLogo = await project.getLogo();
    if (logo) {
      const path = await this.uploadService.saveImageToSystem(
        logo,
        'uploads/projects',
      );
      await project.createLogo({
        original_name: logo.originalname,
        mimetype: logo.mimetype,
        path,
      });
    }
    if (oldLogo) {
      await this.uploadService.deleteFileFromSystem(oldLogo.path);
      await oldLogo.destroy();
    }
  }
  async getLogo(
    projectId: number,
  ): Promise<{ file: ReadStream; mimetype: string } | null> {
    const project = await this.getProjectById(projectId);
    const logo = await project.getLogo();
    if (!logo) return null;
    const file = this.uploadService.getImage(logo.path);
    return { file, mimetype: logo.mimetype };
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

  async deleteProject(project_id: number, user_id: number): Promise<void> {
    const dbProject = await this.projectRepository.findByPk(project_id);
    if (!dbProject)
      throw new CustomBadRequestExceptions({ project: 'Project not found' });
    if (dbProject.creator_id !== user_id)
      throw new CustomBadRequestExceptions({
        project: 'You are not an owner to delete this project!',
      });
    await dbProject.destroy();
  }

  async quitProject(project_id: number, user_id: number): Promise<void> {
    const dbProject = await this.projectRepository.findByPk(project_id);
    if (dbProject.creator_id === user_id) {
      throw new CustomBadRequestExceptions({
        project: 'Owner can not quit from project',
      });
    }
    await dbProject.removeUser(user_id);
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
    return await dbUser.getProjects({
      include: [
        { model: Image, as: 'logo' },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'email'],
        },
      ],
      joinTableAttributes: [],
      attributes: { exclude: ['logo_id'] },
      order: [['createdAt', 'DESC']],
    });
  }
  // TODO закрыть это каким-то образом(includes, attributes, etc...)
  async getProjectById(
    projectId: number,
    meta?: {
      include?: Includeable | Includeable[];
      atttribtutes?: FindAttributeOptions;
    },
  ) {
    return await this.projectRepository.findByPk(projectId, {
      include: meta?.include,
      attributes: meta?.atttribtutes,
    });
  }
  async getProjectInfo(projectId: number) {
    const project = await this.getProjectById(projectId, {
      include: [
        { model: Image, as: 'logo' },
        { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
      ],
      atttribtutes: { exclude: ['logo_id'] },
    });
    if (!project)
      throw new CustomBadRequestExceptions({ project: 'Project not found' });
    return project;
  }
  async getAllProject(): Promise<Project[]> {
    return await this.projectRepository.findAll();
  }

  async inviteUserToProject(projectId: number, email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user)
      throw new CustomBadRequestExceptions({ email: 'User not found' });
    await user.addProject(projectId);
  }
}
