import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class ElapsedTimeInterceptor implements NestInterceptor {
    private readonly logger = new Logger(ElapsedTimeInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const start = Date.now();
        const type = context.getType<'http' | 'graphql' | 'rpc'>();

        if (type === 'http') {
            const http = context.switchToHttp();
            const request = http.getRequest();
            const response = http.getResponse();

            return next.handle().pipe(
                map((data) => {
                    const elapsed = Date.now() - start;
                    const elapsedLabel = `${elapsed}ms`;

                    this.logger.log(`${request.method} ${request.url} - ${elapsedLabel}`);
                    response.setHeader('X-Elapsed-Time', elapsedLabel);

                    const acceptHeader = request.headers['accept'] || '';
                    const isHtml =
                        typeof acceptHeader === 'string' && acceptHeader.includes('text/html');

                    if (isHtml && data && typeof data === 'object' && !Array.isArray(data)) {
                        return {
                            ...data,
                            serverElapsedTime: elapsedLabel,
                        };
                    }

                    return data;
                }),
            );
        }

        return next.handle().pipe(
            tap(() => {
                const elapsed = Date.now() - start;
                this.logger.log(`graphql request - ${elapsed}ms`);
            }),
        );
    }
}