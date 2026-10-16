import {
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    HttpCode,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Res,
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
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillResponseDto } from './dto/skill-response.dto';
import { SkillsQueryDto } from './dto/skills-query.dto';
import {PublicAccess, VerifySession} from "supertokens-nestjs";
import UserRoles from "supertokens-node/recipe/userroles";
import { StorageService } from '../storage/storage.service';
import { UploadSkillImageDto } from './dto/upload-skill-image.dto';
import { UploadFileResponseDto } from '../storage/dto/upload-file-response.dto';

@ApiTags('Skills')
@Controller('api/skills')
export class SkillsApiController {
    constructor(
        private readonly skillsService: SkillsService,
        private readonly storageService: StorageService,
    ) {}

    @Get()
    @PublicAccess()
    @ApiOperation({ summary: 'Получить список навыков' })
    @ApiOkResponse({
        description: 'Список навыков',
        type: SkillResponseDto,
        isArray: true,
    })
    @ApiBadRequestResponse({ description: 'Некорректные параметры запроса' })
    async findAll(
        @Query() query: SkillsQueryDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        const { items, total } = await this.skillsService.findAllPaginated(page, limit);

        const lastPage = Math.max(1, Math.ceil(total / limit));
        const links: string[] = [];

        if (page > 1) {
            links.push(`</api/skills?page=${page - 1}&limit=${limit}>; rel="prev"`);
        }
        if (page < lastPage) {
            links.push(`</api/skills?page=${page + 1}&limit=${limit}>; rel="next"`);
        }

        if (links.length > 0) {
            res.setHeader('Link', links.join(', '));
        }

        return items;
    }

    @Get(':id')
    @PublicAccess()
    @ApiOperation({ summary: 'Получить один навык по id' })
    @ApiOkResponse({
        description: 'Навык найден',
        type: SkillResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Навык не найден' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.skillsService.findOne(id);
    }

    @Post('upload')
    @PublicAccess()
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Загрузить изображение навыка' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Файл изображения навыка',
        type: UploadSkillImageDto,
    })
    @ApiCreatedResponse({
        description: 'Файл успешно загружен',
        type: UploadFileResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Файл не был передан или имеет неверный формат' })
    @ApiInternalServerErrorResponse({ description: 'Ошибка загрузки файла в хранилище' })
    async uploadSkillImage(
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
        const url = await this.storageService.uploadFile(file, 'skills');
        return { url };
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
    @ApiOperation({ summary: 'Создать навык' })
    @ApiCreatedResponse({
        description: 'Навык создан',
        type: SkillResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Некорректное тело запроса' })
    async create(@Body() dto: CreateSkillDto) {
        return this.skillsService.create(dto);
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
    @ApiOperation({ summary: 'Обновить навык' })
    @ApiOkResponse({
        description: 'Навык обновлён',
        type: SkillResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Некорректные данные' })
    @ApiNotFoundResponse({ description: 'Навык не найден' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateSkillDto,
    ) {
        return this.skillsService.update(id, dto);
    }

    @Delete(':id')
    @VerifySession({ roles: ['admin'] })
    @HttpCode(204)
    @ApiOperation({ summary: 'Удалить навык' })
    @ApiNoContentResponse({ description: 'Навык удалён' })
    @ApiNotFoundResponse({ description: 'Навык не найден' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.skillsService.remove(id);
    }
}
