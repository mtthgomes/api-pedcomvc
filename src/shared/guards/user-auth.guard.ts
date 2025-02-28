import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { TokenUserService } from '@app/modules/user/auth/user.guard';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private tokenUserService: TokenUserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) { throw new HttpException("Logout", HttpStatus.UNAUTHORIZED); }
    const authToken = authHeader.split(' ')[1];
    if (!authToken) { throw new HttpException("Logout", HttpStatus.UNAUTHORIZED); }
    const validationResponse = await this.tokenUserService.findByToken(authToken);
    if(validationResponse.error){ throw new HttpException(validationResponse.data, HttpStatus.BAD_REQUEST); }
    if(!validationResponse.data){ throw new HttpException("Logout", HttpStatus.BAD_REQUEST); }
    request.userId = validationResponse.data;
    if(!request.userId){ throw new HttpException("Logout", HttpStatus.BAD_REQUEST); }
    return true
  }
}