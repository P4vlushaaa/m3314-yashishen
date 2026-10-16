import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Redirect,
  Render,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { PortfolioService } from '../portfolio/portfolio.service';
import {PublicAccess, VerifySession} from "supertokens-nestjs";
import UserRoles from "supertokens-node/recipe/userroles";
import { getSessionModel } from '../common/utils/view.utils';

@Controller('skills')
export class SkillsController {
  constructor(
      private readonly skillsService: SkillsService,
      private readonly portfolioService: PortfolioService,
  ) {}

  @Get()
  @PublicAccess()
  @Render('skills/index')
  async getSkillsPage(@Query('auth') auth?: string) {
    const skills = await this.skillsService.findAll();
    const contacts = await this.portfolioService.getContacts();

    return {
      ...getSessionModel(auth),
      skills,
      contacts,
    };
  }

  @Get('add')
  @VerifySession({
    options: {
      overrideGlobalClaimValidators: async (globalValidators) => [
        ...globalValidators,
        UserRoles.UserRoleClaim.validators.includesAny(['user', 'admin']),
      ],
    },
  })
  @Render('skills/add')
  async getAddSkillPage(@Query('auth') auth?: string) {
    const contacts = await this.portfolioService.getContacts();

    return {
      ...getSessionModel(auth),
      contacts,
    };
  }

  @Post()
  @VerifySession({
    options: {
      overrideGlobalClaimValidators: async (globalValidators) => [
        ...globalValidators,
        UserRoles.UserRoleClaim.validators.includesAny(['user', 'admin']),
      ],
    },
  })
  @Redirect('/skills')
  async createSkill(@Body() body: Record<string, string>) {
    await this.skillsService.create({
      title: body.title,
      description: body.description,
      imageUrl: body.imageUrl,
    });

    return { url: '/skills' };
  }

  @Get(':id')
  @PublicAccess()
  @Render('skills/show')
  async getSkillPage(
      @Param('id', ParseIntPipe) id: number,
      @Query('auth') auth?: string,
  ) {
    const skill = await this.skillsService.findOne(id);
    const contacts = await this.portfolioService.getContacts();

    return {
      ...getSessionModel(auth),
      skill,
      contacts,
    };
  }

  @Get(':id/edit')
  @VerifySession({
    options: {
      overrideGlobalClaimValidators: async (globalValidators) => [
        ...globalValidators,
        UserRoles.UserRoleClaim.validators.includesAny(['user', 'admin']),
      ],
    },
  })
  @Render('skills/edit')
  async getEditSkillPage(
      @Param('id', ParseIntPipe) id: number,
      @Query('auth') auth?: string,
  ) {
    const skill = await this.skillsService.findOne(id);
    const contacts = await this.portfolioService.getContacts();

    return {
      ...getSessionModel(auth),
      skill,
      contacts,
    };
  }

  @Post(':id/edit')
  @VerifySession({
    options: {
      overrideGlobalClaimValidators: async (globalValidators) => [
        ...globalValidators,
        UserRoles.UserRoleClaim.validators.includesAny(['user', 'admin']),
      ],
    },
  })
  @Redirect('/skills')
  async updateSkill(
      @Param('id', ParseIntPipe) id: number,
      @Body() body: Record<string, string>,
  ) {
    await this.skillsService.update(id, {
      title: body.title,
      description: body.description,
      imageUrl: body.imageUrl,
    });

    return { url: `/skills/${id}` };
  }

  @Post(':id/delete')
  @VerifySession({ roles: ['admin'] })
  @Redirect('/skills')
  async deleteSkill(@Param('id', ParseIntPipe) id: number) {
    await this.skillsService.remove(id);

    return { url: '/skills' };
  }
}