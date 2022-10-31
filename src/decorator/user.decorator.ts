import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DateTimeUtil } from '../common/date-time-util';

export const UserParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const DateParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return {
      date: DateTimeUtil.toLocalDateTimeBy(request.params.date + ' 00:00:00'),
    };
  },
);
