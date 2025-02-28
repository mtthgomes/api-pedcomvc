import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetAdminId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    return request.adminId; // Assume que o Guard já anexou o userId ao objeto request
  },
);
