import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetDoctorId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    return request.doctorId;  // Assume que o Guard já anexou o doctorId ao objeto request
  },
);