import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateSkillInput {
  title: string;
  description: string;
  imageUrl?: string;
}

export interface UpdateSkillInput {
  title?: string;
  description?: string;
  imageUrl?: string;
}

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.skill.findMany({
        skip,
        take: limit,
        orderBy: {
          id: 'asc',
        },
      }),
      this.prisma.skill.count(),
    ]);

    return { items, total };
  }

  async findAll() {
    return this.prisma.skill.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const skill = await this.prisma.skill.findUnique({
      where: { id },
    });

    if (!skill) {
      throw new NotFoundException(`Skill with id=${id} not found`);
    }

    return skill;
  }

  async create(data: CreateSkillInput) {
    const profile = await this.prisma.profile.findFirst();

    if (!profile) {
      throw new NotFoundException('Profile not found for skill creation');
    }

    return this.prisma.skill.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl || null,
        profileId: profile.id,
      },
    });
  }

  async update(id: number, data: UpdateSkillInput) {
    await this.findOne(id);

    return this.prisma.skill.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl || null,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.skill.delete({
      where: { id },
    });
  }
}