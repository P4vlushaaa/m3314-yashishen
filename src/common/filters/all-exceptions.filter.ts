import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const superTokensUnauthorised =
            typeof exception === 'object' &&
            exception !== null &&
            'type' in exception &&
            (exception as { type?: string }).type === 'UNAUTHORISED';

        if (superTokensUnauthorised) {
            response.status(HttpStatus.UNAUTHORIZED).json({
                statusCode: HttpStatus.UNAUTHORIZED,
                path: request.url,
                timestamp: new Date().toISOString(),
                message:
                    exception instanceof Error
                        ? exception.message
                        : 'Authentication required',
            });
            return;
        }

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse =
            exception instanceof HttpException
                ? exception.getResponse()
                : null;

        if (typeof exceptionResponse === 'string') {
            response.status(status).json({
                statusCode: status,
                path: request.url,
                timestamp: new Date().toISOString(),
                message: exceptionResponse,
            });
            return;
        }

        if (
            exceptionResponse &&
            typeof exceptionResponse === 'object' &&
            !Array.isArray(exceptionResponse)
        ) {
            response.status(status).json({
                statusCode: status,
                path: request.url,
                timestamp: new Date().toISOString(),
                ...(exceptionResponse as Record<string, unknown>),
            });
            return;
        }

        response.status(status).json({
            statusCode: status,
            path: request.url,
            timestamp: new Date().toISOString(),
            error:
                exception instanceof Error
                    ? exception.message
                    : 'Internal server error',
        });
    }
}