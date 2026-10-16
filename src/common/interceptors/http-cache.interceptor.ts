import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Observable, from, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        if (request.method !== 'GET') {
            return next.handle();
        }

        const key = `http-cache:${request.originalUrl}`;

        return from(this.cacheManager.get(key)).pipe(
            switchMap((cachedValue) => {
                if (cachedValue) {
                    response.setHeader('X-Cache', 'HIT');
                    return of(cachedValue);
                }

                response.setHeader('X-Cache', 'MISS');

                return next.handle().pipe(
                    tap(async (data) => {
                        await this.cacheManager.set(key, data, 5000);
                    }),
                );
            }),
        );
    }
}