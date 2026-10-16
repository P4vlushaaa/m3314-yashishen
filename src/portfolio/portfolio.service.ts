import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PortfolioService {
    constructor(private readonly prisma: PrismaService) {}

    async getProfileWithContent() {
        return this.prisma.profile.findFirst({
            include: {
                skills: true,
                projects: true,
                contacts: true,
            },
        });
    }

    async getProfileOnly() {
        return this.prisma.profile.findFirst({
            include: {
                contacts: true,
            },
        });
    }

    mapContactType(type: string) {
        switch (type) {
            case 'email':
                return 'Почта';
            case 'telegram':
                return 'Telegram';
            case 'github':
                return 'GitHub';
            default:
                return type;
        }
    }

    async getContacts() {
        const profile = await this.prisma.profile.findFirst({
            include: {
                contacts: true,
            },
        });

        return (profile?.contacts ?? []).map((contact) => ({
            ...contact,
            label: this.mapContactType(contact.type),
        }));
    }

    async findAll() {
        return this.prisma.profile.findMany({
            orderBy: { id: 'asc' },
        });
    }

    async findOne(id: number) {
        const profile = await this.prisma.profile.findUnique({
            where: { id },
        });

        if (!profile) {
            throw new NotFoundException(`Profile with id=${id} not found`);
        }

        return profile;
    }

    async findProjectsByProfileId(id: number) {
        await this.findOne(id);

        return this.prisma.project.findMany({
            where: { profileId: id },
            orderBy: { id: 'asc' },
        });
    }

    async findSkillsByProfileId(id: number) {
        await this.findOne(id);

        return this.prisma.skill.findMany({
            where: { profileId: id },
            orderBy: { id: 'asc' },
        });
    }

    async findContactsByProfileId(id: number) {
        await this.findOne(id);

        return this.prisma.contact.findMany({
            where: { profileId: id },
            orderBy: { id: 'asc' },
        });
    }
    async findProjectByProfileId(profileId: number, projectId: number) {
    await this.findOne(profileId);

    const project = await this.prisma.project.findFirst({
        where: {
            id: projectId,
            profileId,
        },
    });

    if (!project) {
        throw new NotFoundException(
            `Project with id=${projectId} not found for profile=${profileId}`,
        );
    }

    return project;
    }

    async findSkillByProfileId(profileId: number, skillId: number) {
        await this.findOne(profileId);

    const skill = await this.prisma.skill.findFirst({
        where: {
            id: skillId,
            profileId,
        },
    });

    if (!skill) {
        throw new NotFoundException(
            `Skill with id=${skillId} not found for profile=${profileId}`,
        );
    }

    return skill;
    }

    async findContactByProfileId(profileId: number, contactId: number) {
        await this.findOne(profileId);

    const contact = await this.prisma.contact.findFirst({
        where: {
            id: contactId,
            profileId,
        },
    });

    if (!contact) {
        throw new NotFoundException(
            `Contact with id=${contactId} not found for profile=${profileId}`,
        );
    }

    return contact;
    }
}
