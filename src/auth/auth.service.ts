import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SyncUserDto } from './dto/sync-user.dto';
import UserRoles from 'supertokens-node/recipe/userroles';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

    async syncUser(dto: SyncUserDto) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: dto.email },
                    { externalAuthId: dto.externalAuthId },
                ],
            },
        });

        let user;

        if (existingUser) {
            user = await this.prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    email: dto.email,
                    externalAuthId: dto.externalAuthId,
                },
            });
        } else {
            user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    externalAuthId: dto.externalAuthId,
                },
            });
        }

        await UserRoles.createNewRoleOrAddPermissions('user', []);
        await UserRoles.addRoleToUser('public', dto.externalAuthId, 'user');

        return user;
    }

    async assignRole(externalAuthId: string, role: string) {
        await UserRoles.createNewRoleOrAddPermissions(role, []);
        return UserRoles.addRoleToUser('public', externalAuthId, role);
    }

    async getRoles(externalAuthId: string) {
        return UserRoles.getRolesForUser('public', externalAuthId);
    }

    async findByExternalAuthId(externalAuthId: string) {
        return this.prisma.user.findUnique({
            where: { externalAuthId },
            include: {
                profile: true,
            },
        });
    }
}