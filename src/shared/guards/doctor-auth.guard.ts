import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { tokenDoctorService } from '@app/modules/doctor/auth/doctor.guard';

@Injectable()
export class DoctorAuthGuard implements CanActivate {
  constructor(private tokenDoctorService: tokenDoctorService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) { throw new HttpException("Logout", HttpStatus.UNAUTHORIZED); }
    const authToken = authHeader.split(' ')[1];
    if (!authToken) { throw new HttpException("Logout", HttpStatus.UNAUTHORIZED); }
    const validationResponse = await this.tokenDoctorService.findByToken(authToken);
    if(validationResponse.error){ throw new HttpException(validationResponse.data, HttpStatus.BAD_REQUEST); }
    if(!validationResponse.data){ throw new HttpException("Logout", HttpStatus.BAD_REQUEST); }
    request.doctorId = validationResponse.data;
    if(!request.doctorId){ throw new HttpException("Logout", HttpStatus.BAD_REQUEST); }
    return true
  }
}