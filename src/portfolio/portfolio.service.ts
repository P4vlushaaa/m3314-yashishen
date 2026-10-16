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
}
