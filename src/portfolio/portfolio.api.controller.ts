import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import {
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { PortfolioResponseDto } from './dto/portfolio-response.dto';
import { ProjectResponseDto } from '../projects/dto/project-response.dto';
import { SkillResponseDto } from '../skills/dto/skill-response.dto';
import { ContactResponseDto } from './dto/contact-response.dto';
import {PublicAccess} from "supertokens-nestjs";

@ApiTags('Portfolio')
@Controller('api/portfolio')
export class PortfolioApiController {
    constructor(private readonly portfolioService: PortfolioService) {}

    @Get()
    @PublicAccess()
    @ApiOperation({ summary: 'Получить список профилей' })
    @ApiOkResponse({
        description: 'Список профилей',
        type: PortfolioResponseDto,
        isArray: true,
    })
    async findAll() {
        return this.portfolioService.findAll();
    }

    @Get(':id')
    @PublicAccess()
    @ApiOperation({ summary: 'Получить профиль по id' })
    @ApiOkResponse({
        description: 'Профиль найден',
        type: PortfolioResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Профиль не найден' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.portfolioService.findOne(id);
    }

    @Get(':id/projects')
    @PublicAccess()
    @ApiOperation({ summary: 'Получить проекты профиля' })
    @ApiOkResponse({
        description: 'Список проектов профиля',
        type: ProjectResponseDto,
        isArray: true,
    })
    @ApiNotFoundResponse({ description: 'Профиль не найден' })
    async findProjects(@Param('id', ParseIntPipe) id: number) {
        return this.portfolioService.findProjectsByProfileId(id);
    }

    @Get(':id/skills')
    @PublicAccess()
    @ApiOperation({ summary: 'Получить навыки профиля' })
    @ApiOkResponse({
        description: 'Список навыков профиля',
        type: SkillResponseDto,
        isArray: true,
    })
    @ApiNotFoundResponse({ description: 'Профиль не найден' })
    async findSkills(@Param('id', ParseIntPipe) id: number) {
        return this.portfolioService.findSkillsByProfileId(id);
    }

    @Get(':id/contacts')
    @PublicAccess()
    @ApiOperation({ summary: 'Получить контакты профиля' })
    @ApiOkResponse({
        description: 'Список контактов профиля',
        type: ContactResponseDto,
        isArray: true,
    })
    @ApiNotFoundResponse({ description: 'Профиль не найден' })
    async findContacts(@Param('id', ParseIntPipe) id: number) {
        return this.portfolioService.findContactsByProfileId(id);
    }
    
    @Get(':id/projects/:projectId')
    @PublicAccess()
    @ApiOperation({ summary: 'Получить конкретный проект профиля' })
    @ApiOkResponse({
        description: 'Проект найден',
        type: ProjectResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Профиль или проект не найден' })
    async findProject(
        @Param('id', ParseIntPipe) id: number,
        @Param('projectId', ParseIntPipe) projectId: number,
    ) {
        return this.portfolioService.findProjectByProfileId(id, projectId);
    }   
    @Get(':id/skills/:skillId')
    @PublicAccess()
    @ApiOperation({ summary: 'Получить конкретный навык профиля' })
    @ApiOkResponse({
        description: 'Навык найден',
        type: SkillResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Профиль или навык не найден' })
    async findSkill(
        @Param('id', ParseIntPipe) id: number,
        @Param('skillId', ParseIntPipe) skillId: number,
    ) {
        return this.portfolioService.findSkillByProfileId(id, skillId);
    }
    @Get(':id/contacts/:contactId')
    @PublicAccess()
    @ApiOperation({ summary: 'Получить конкретный контакт профиля' })
    @ApiOkResponse({
        description: 'Контакт найден',
        type: ContactResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Профиль или контакт не найден' })
    async findContact(
        @Param('id', ParseIntPipe) id: number,
        @Param('contactId', ParseIntPipe) contactId: number,
    ) {
        return this.portfolioService.findContactByProfileId(id, contactId);
    }
}