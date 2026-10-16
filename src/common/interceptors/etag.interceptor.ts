import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class EtagInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const http = context.switchToHttp();
        const request = http.getRequest();
        const response = http.getResponse();

        return next.handle().pipe(
            map((data) => {
                const method = request.method;

                if (method !== 'GET' && method !== 'HEAD') {
                    return data;
                }

                const payload = JSON.stringify(data ?? null);
                const etag = `"${createHash('sha1').update(payload).digest('hex')}"`;

                response.setHeader('ETag', etag);

                const ifNoneMatch = request.headers['if-none-match'];

                if (ifNoneMatch === etag) {
                    response.status(304).send();
                    return;
                }

                return data;
            }),
        );
    }
}