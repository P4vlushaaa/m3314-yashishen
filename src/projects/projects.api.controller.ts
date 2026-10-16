import {
    BadRequestException,
    Body,
    Controller,
    Delete, FileTypeValidator,
    Get,
    Header,
    HttpCode, MaxFileSizeValidator,
    Param, ParseFilePipe,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { ProjectsQueryDto } from './dto/projects-query.dto';
import { EtagInterceptor } from '../common/interceptors/etag.interceptor';
import { HttpCacheInterceptor } from '../common/interceptors/http-cache.interceptor';
import { StorageService } from '../storage/storage.service';
import { UploadProjectImageDto } from './dto/upload-project-image.dto';
import { StorageFilesListResponseDto } from '../storage/dto/storage-files-list-response.dto';
import { StorageFilesQueryDto } from '../storage/dto/storage-files-query.dto';
import {UploadFileResponseDto} from "../storage/dto/upload-file-response.dto";
import {PublicAccess, VerifySession} from "supertokens-nestjs";
import UserRoles from "supertokens-node/recipe/userroles";

@ApiTags('Projects')
@Controller('api/projects')
export class ProjectsApiController {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly storageService: StorageService,
    ) {}

    @Get()
    @PublicAccess()
    @UseInterceptors(HttpCacheInterceptor, EtagInterceptor)
    @ApiOperation({ summary: 'Получить список проектов' })
    @ApiOkResponse({
        description: 'Список проектов',
        type: ProjectResponseDto,
        isArray: true,
    })
    @Header('Cache-Control', 'public, max-age=60')
    @ApiBadRequestResponse({ description: 'Некорректные параметры запроса' })
    async findAll(
        @Query() query: ProjectsQueryDto,
        @Req() req: Request,
    ) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        const { items, total } = await this.projectsService.findAllPaginated(page, limit);

        const lastPage = Math.max(1, Math.ceil(total / limit));
        const links: string[] = [];

        if (page > 1) {
            links.push(`</api/projects?page=${page - 1}&limit=${limit}>; rel="prev"`);
        }
        if (page < lastPage) {
            links.push(`</api/projects?page=${page + 1}&limit=${limit}>; rel="next"`);
        }

        if (links.length > 0) {
            req.res?.setHeader('Link', links.join(', '));
        }

        console.log('DB QUERY: projects list');

        return items;
    }

    @Get('images')
    @PublicAccess()
    @ApiOperation({ summary: 'Получить список изображений проектов из хранилища' })
    @ApiOkResponse({
        description: 'Список изображений проектов',
        type: StorageFilesListResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Некорректные параметры запроса' })
    async getProjectImages(@Query() query: StorageFilesQueryDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        return this.storageService.listFiles('projects', page, limit);
    }

    @Get(':id')
    @PublicAccess()
    @ApiOperation({ summary: 'Получить один проект по id' })
    @ApiOkResponse({
        description: 'Проект найден',
        type: ProjectResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Проект не найден' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.projectsService.findOne(id);
    }

    @Post('upload')
    @PublicAccess()
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Загрузить изображение проекта' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Файл изображения проекта',
        type: UploadProjectImageDto,
    })
    @ApiCreatedResponse({
        description: 'Файл успешно загружен',
        type: UploadFileResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Файл не был передан или имеет неверный формат' })
    @ApiInternalServerErrorResponse({ description: 'Ошибка загрузки файла в хранилище' })
    async uploadProjectImage(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
                    new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        const url = await this.storageService.uploadFile(file, 'projects');
        return { url };
    }

    @Post()
    @ApiOperation({ summary: 'Создать проект' })
    @VerifySession({
        options: {
            overrideGlobalClaimValidators: async (globalValidators) => [
                ...globalValidators,
                UserRoles.UserRoleClaim.validators.includesAny(['user', 'admin']),
            ],
        },
    })
    @ApiCreatedResponse({
        description: 'Проект создан',
        type: ProjectResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Некорректное тело запроса' })
    async create(@Body() dto: CreateProjectDto) {
        return this.projectsService.create(dto);
    }

    @Patch(':id')
    @VerifySession({
        options: {
            overrideGlobalClaimValidators: async (globalValidators) => [
                ...globalValidators,
                UserRoles.UserRoleClaim.validators.includesAny(['user', 'admin']),
            ],
        },
    })
    @ApiOperation({ summary: 'Обновить проект' })
    @ApiOkResponse({
        description: 'Проект обновлён',
        type: ProjectResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Некорректные данные' })
    @ApiNotFoundResponse({ description: 'Проект не найден' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateProjectDto,
    ) {
        return this.projectsService.update(id, dto);
    }

    @Delete(':id')
    @VerifySession({ roles: ['admin'] })
    @HttpCode(204)
    @ApiOperation({ summary: 'Удалить проект' })
    @ApiNoContentResponse({ description: 'Проект удалён' })
    @ApiNotFoundResponse({ description: 'Проект не найден' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.projectsService.remove(id);
    }
}