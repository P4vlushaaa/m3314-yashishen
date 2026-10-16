import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { SkillsModule } from './skills/skills.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { QueryComplexityPlugin } from './graphql/query-complexity.plugin';
import { CacheModule } from '@nestjs/cache-manager';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { SuperTokensModule, SuperTokensAuthGuard } from 'supertokens-nestjs';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import UserRoles from 'supertokens-node/recipe/userroles';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'public'),
            exclude: ['/graphql', '/graphql/{*splat}', '/api', '/api/{*splat}'],
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            sortSchema: true,
            graphiql: true,
            plugins: [new QueryComplexityPlugin()],
        }),
        CacheModule.register({
            isGlobal: true,
            ttl: 5000,
        }),
        SuperTokensModule.forRoot({
            framework: 'express',
            supertokens: {
                connectionURI: process.env.SUPERTOKENS_CONNECTION_URI!,
                apiKey: process.env.SUPERTOKENS_API_KEY,
            },
            appInfo: {
                appName: process.env.SUPERTOKENS_APP_NAME!,
                apiDomain: process.env.SUPERTOKENS_API_DOMAIN!,
                websiteDomain: process.env.SUPERTOKENS_WEBSITE_DOMAIN!,
                apiBasePath: '/auth',
                websiteBasePath: '/auth',
            },
            recipeList: [
                EmailPassword.init(),
                Session.init({
                    getTokenTransferMethod: () => 'cookie',
                }),
                UserRoles.init(),
            ],
        }),
        PrismaModule,
        ProjectsModule,
        SkillsModule,
        PortfolioModule,
        AuthModule.register(),
    ],
    controllers: [AppController],
    providers: [AppService,
        {
            provide: APP_GUARD,
            useClass: SuperTokensAuthGuard,
        },],
})
export class AppModule {}
