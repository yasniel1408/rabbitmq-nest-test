import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto as ClassConstructor<unknown>, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
