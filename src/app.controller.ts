import { Controller, Get, Query, Render } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { getSessionModel, mapContactType } from './common/utils/view.utils';
import {PublicAccess} from "supertokens-nestjs";

@Controller()
export class AppController {
    constructor(private readonly prisma: PrismaService) {}

    private async loadContacts() {
        const profile = await this.prisma.profile.findFirst({
            include: {
                contacts: true,
            },
        });

        return (profile?.contacts ?? []).map((contact) => ({
            ...contact,
            label: mapContactType(contact.type),
        }));
    }

    @Get('db-test')
    @PublicAccess()
    async dbTest() {
        const profile = await this.prisma.profile.findFirst({
            include: {
                skills: true,
                projects: true,
                contacts: true,
                user: true,
            },
        });

        return {
            ok: true,
            profile,
        };
    }

    @Get('auth')
    @PublicAccess()
    @Render('auth')
    async getAuthPage(@Query('auth') auth?: string) {
        const contacts = await this.loadContacts();

        return {
            ...getSessionModel(auth),
            contacts,
        };
    }
}
