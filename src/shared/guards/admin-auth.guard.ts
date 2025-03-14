import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { TokenAdminService } from '@app/modules/admin/auth/admin.guard';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private tokenAdminService: TokenAdminService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) { throw new HttpException("Logout", HttpStatus.UNAUTHORIZED); }
    const authToken = authHeader.split(' ')[1];
    if (!authToken) { throw new HttpException("Logout", HttpStatus.UNAUTHORIZED); }
    const validationResponse = await this.tokenAdminService.findByToken(authToken);
    if(validationResponse.error){ throw new HttpException(validationResponse.data, HttpStatus.BAD_REQUEST); }
    if(!validationResponse.data){ throw new HttpException("Logout", HttpStatus.BAD_REQUEST); }
    request.adminId = validationResponse.data;
    if(!request.adminId){ throw new HttpException("Logout", HttpStatus.BAD_REQUEST); }
    return true
  }
}