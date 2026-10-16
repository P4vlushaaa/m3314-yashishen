import { Injectable, NotFoundException, MessageEvent } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Observable, Subject } from 'rxjs';

export interface CreateProjectInput {
  title: string;
  description: string;
  repositoryUrl?: string;
  imageUrl?: string;
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
  repositoryUrl?: string;
  imageUrl?: string;
}

@Injectable()
export class ProjectsService {
  private readonly eventsSubject = new Subject<{ data: any }>();
  public readonly events$ = this.eventsSubject.asObservable();

  constructor(private readonly prisma: PrismaService) {}

  private emitEvent(data: any) {
    this.eventsSubject.next({
      data,
    });
  }

  async findAllPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.project.findMany({
        skip,
        take: limit,
        orderBy: {
          id: 'asc',
        },
      }),
      this.prisma.project.count(),
    ]);

    return { items, total };
  }

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with id=${id} not found`);
    }

    return project;
  }

  async create(data: CreateProjectInput) {
    const profile = await this.prisma.profile.findFirst();

    if (!profile) {
      throw new NotFoundException('Profile not found for project creation');
    }

    const project = await this.prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        repositoryUrl: data.repositoryUrl || null,
        imageUrl: data.imageUrl || null,
        profileId: profile.id,
      },
    });

    this.emitEvent({
      type: 'created',
      entity: 'project',
      id: project.id,
      title: project.title,
      message: `Проект "${project.title}" создан`,
    });

    return project;
  }

  async update(id: number, data: UpdateProjectInput) {
    await this.findOne(id);

    const project = await this.prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        repositoryUrl: data.repositoryUrl || null,
        imageUrl: data.imageUrl || null,
      },
    });

    this.emitEvent({
      type: 'updated',
      entity: 'project',
      id: project.id,
      title: project.title,
      message: `Проект "${project.title}" обновлён`,
    });

    return project;
  }

  async remove(id: number) {
    const project = await this.findOne(id);

    const deleted = await this.prisma.project.delete({
      where: { id },
    });

    this.emitEvent({
      type: 'deleted',
      entity: 'project',
      id: project.id,
      title: project.title,
      message: `Проект "${project.title}" удалён`,
    });

    return deleted;
  }
}