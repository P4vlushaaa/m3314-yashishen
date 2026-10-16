import { Controller, Get, Query, Render } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import {PublicAccess} from "supertokens-nestjs";
import { getSessionModel } from '../common/utils/view.utils';

@Controller()
export class PortfolioController {
    constructor(private readonly portfolioService: PortfolioService) {}

    @Get()
    @PublicAccess()
    @Render('index')
    async getIndexPage(@Query('auth') auth?: string) {
        const profile = await this.portfolioService.getProfileWithContent();
        const contacts = await this.portfolioService.getContacts();

        return {
            ...getSessionModel(auth),
            profile,
            skills: profile?.skills ?? [],
            projects: profile?.projects ?? [],
            contacts,
        };
    }

    @Get('about')
    @PublicAccess()
    @Render('about')
    async getAboutPage(@Query('auth') auth?: string) {
        const profile = await this.portfolioService.getProfileOnly();
        const contacts = await this.portfolioService.getContacts();

        return {
            ...getSessionModel(auth),
            profile,
            contacts,
        };
    }
}