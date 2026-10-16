import { Injectable, OnModuleInit } from '@nestjs/common';
import UserRoles from 'supertokens-node/recipe/userroles';

@Injectable()
export class AuthInitService implements OnModuleInit {
    async onModuleInit() {
        await UserRoles.createNewRoleOrAddPermissions('admin', []);
        await UserRoles.createNewRoleOrAddPermissions('user', []);
    }
}