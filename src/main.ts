import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ElapsedTimeInterceptor } from './common/interceptors/elapsed-time.interceptor';

import supertokens from 'supertokens-node';
import { middleware, errorHandler } from 'supertokens-node/framework/express';
import {SuperTokensExceptionFilter} from "supertokens-nestjs";

async function bootstrap() {

    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors({
        origin: process.env.SUPERTOKENS_WEBSITE_DOMAIN,
        allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
        credentials: true,
    });

    app.use(middleware());

    app.setBaseViewsDir(join(process.cwd(), 'views'));
    app.setViewEngine('hbs');

    hbs.registerPartials(join(process.cwd(), 'views', 'partials'));

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('Web Portfolio API')
        .setDescription('REST API для веб-портфолио')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    app.useGlobalFilters(
        new SuperTokensExceptionFilter(),
        new AllExceptionsFilter(),
    );
    app.useGlobalInterceptors(new ElapsedTimeInterceptor());

    app.use(errorHandler());

    const port = process.env.PORT || 3000;
    await app.listen(port);
}

void bootstrap();