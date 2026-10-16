import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublicAccess } from 'supertokens-nestjs';
import { AuthService } from './auth.service';
import { SyncUserDto } from './dto/sync-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import Session from 'supertokens-node/recipe/session';
import { Request, Response } from 'express';
import UserRoles from "supertokens-node/recipe/userroles";

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('sync-user')
    @PublicAccess()
    @ApiOperation({ summary: 'Синхронизировать пользователя SuperTokens с локальной БД' })
    @ApiCreatedResponse({ description: 'Пользователь синхронизирован' })
    @PublicAccess()
    async syncUser(
        @Body() dto: SyncUserDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const user = await this.authService.syncUser(dto);

        const session = await Session.getSession(req, res, {
            sessionRequired: false,
        });

        if (session && session.getUserId() === dto.externalAuthId) {
            await session.fetchAndSetClaim(UserRoles.UserRoleClaim);
        }
        return user;
    }

    @Post('assign-role')
    @PublicAccess()
    @ApiOperation({ summary: 'Назначить роль пользователю SuperTokens' })
    @ApiCreatedResponse({ description: 'Роль назначена' })
    async assignRole(@Body() dto: AssignRoleDto) {
        return this.authService.assignRole(dto.externalAuthId, dto.role);
    }

    @Get('me')
    @PublicAccess()
    async getMe(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const session = await Session.getSession(req, res, {
            sessionRequired: false,
        });

        if (!session) {
            return {
                isAuth: false,
                user: null,
                roles: [],
            };
        }

        const externalAuthId = session.getUserId();
        const user = await this.authService.findByExternalAuthId(externalAuthId);
        const roles = await this.authService.getRoles(externalAuthId);

        return {
            isAuth: true,
            user,
            roles,
        };
    }
}