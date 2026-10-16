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
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { PortfolioService } from '../portfolio/portfolio.service';
import { Observable } from 'rxjs';
import {PublicAccess, VerifySession} from "supertokens-nestjs";
import UserRoles from "supertokens-node/recipe/userroles";
import { getSessionModel } from '../common/utils/view.utils';

@Controller('projects')
export class ProjectsController {
  constructor(
      private readonly projectsService: ProjectsService,
      private readonly portfolioService: PortfolioService,
  ) {}

  @Sse('events')
  events(): Observable<MessageEvent> {
    return this.projectsService.events$;
  }

  @Get()
  @PublicAccess()
  @Render('projects/index')
  async getProjectsPage(@Query('auth') auth?: string) {
    const projects = await this.projectsService.findAll();
    const contacts = await this.portfolioService.getContacts();

    return {
      ...getSessionModel(auth),
      projects,
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
  @Render('projects/add')
  async getAddProjectPage(@Query('auth') auth?: string) {
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
  @Redirect('/projects')
  async createProject(
      @Body() body: Record<string, string>,
  ) {
    await this.projectsService.create({
      title: body.title,
      description: body.description,
      repositoryUrl: body.repositoryUrl,
      imageUrl: body.imageUrl,
    });

    return { url: '/projects' };
  }

  @Get(':id')
  @PublicAccess()
  @Render('projects/show')
  async getProjectPage(
      @Param('id', ParseIntPipe) id: number,
      @Query('auth') auth?: string,
  ) {
    const project = await this.projectsService.findOne(id);
    const contacts = await this.portfolioService.getContacts();

    return {
      ...getSessionModel(auth),
      project,
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
  @Render('projects/edit')
  async getEditProjectPage(
      @Param('id', ParseIntPipe) id: number,
      @Query('auth') auth?: string,
  ) {
    const project = await this.projectsService.findOne(id);
    const contacts = await this.portfolioService.getContacts();

    return {
      ...getSessionModel(auth),
      project,
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
  @Redirect('/projects')
  async updateProject(
      @Param('id', ParseIntPipe) id: number,
      @Body() body: Record<string, string>,
  ) {
    await this.projectsService.update(id, {
      title: body.title,
      description: body.description,
      repositoryUrl: body.repositoryUrl,
      imageUrl: body.imageUrl,
    });

    return { url: `/projects/${id}` };
  }

  @Post(':id/delete')
  @VerifySession({ roles: ['admin'] })
  @Redirect('/projects')
  async deleteProject(@Param('id', ParseIntPipe) id: number) {
    await this.projectsService.remove(id);

    return { url: '/projects' };
  }
}