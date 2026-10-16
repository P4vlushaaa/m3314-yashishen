import { DynamicModule, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthInitService } from './auth-init.service';

@Module({})
export class AuthModule {
    static register(): DynamicModule {
        return {
            module: AuthModule,
            imports: [PrismaModule],
            controllers: [AuthController],
            providers: [AuthService, AuthInitService],
            exports: [AuthService],
        };
    }
}