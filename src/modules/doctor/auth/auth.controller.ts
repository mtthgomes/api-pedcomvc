import { Controller, Post, Body, HttpStatus, UnauthorizedException, Get, Headers, HttpException, Patch, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidatorLoginUseCase } from 'src/shared/validators/login-use-case';
import { LoginDto } from '@app/shared/dtos/auth/login.Dto';
import { RefreshTokenDto } from '@app/shared/dtos/auth/refreshToken.Dto';
import { tokenDoctorService } from './doctor.guard';
import { CreateDoctorDto } from '@app/shared/dtos/auth/createDoctor.dto';
import { firebaseTokenDto } from './dto/firebase.dto';
import { DoctorAuthGuard } from '@app/shared/guards/doctor-auth.guard';
import { GetDoctorId } from '@app/shared/decorator/get-doctor-id.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from '@app/shared/interfaces/multer';
import { descriptionDto } from './dto/profile';

@Controller('doctor/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenDoctorService: tokenDoctorService,
    private readonly validator: ValidatorLoginUseCase
  ) {}

  @Post('signup')
  async create(@Body() doctorDto: CreateDoctorDto): Promise<any> {
    const create = await this.authService.createDoctor(doctorDto);
    if(create.error) { throw new HttpException(create.data, HttpStatus.BAD_REQUEST); }
    return create;
  }

  @Post('login/email')
  async login(@Body() loginDto: LoginDto) {
    const validator = await this.validator.execute(loginDto);
    if(validator.error){ throw new HttpException(validator.data, HttpStatus.BAD_REQUEST) }
    const login = await this.authService.validateDoctor(loginDto.email, loginDto.password);
    if(login.error) { throw new HttpException(login.data, HttpStatus.BAD_REQUEST); }
    return login;
  }

  @Post('login/google')
  async login_google(@Body() loginDto: LoginDto) {
    const validator = await this.validator.execute(loginDto);
    if(validator.error){ throw new HttpException(validator.data, HttpStatus.BAD_REQUEST) }
    const login = await this.authService.validateDoctor(loginDto.email, loginDto.password);
    if(login.error) { throw new HttpException(login.data, HttpStatus.BAD_REQUEST); }
    return login;
  }

  @Post('login/apple')
  async login_apple(@Body() loginDto: LoginDto) {
    const validator = await this.validator.execute(loginDto);
    if(validator.error){ throw new HttpException(validator.data, HttpStatus.BAD_REQUEST) }
    const login = await this.authService.validateDoctor(loginDto.email, loginDto.password);
    if(login.error) { throw new HttpException(login.data, HttpStatus.BAD_REQUEST); }
    return login;
  }

  @Get('info')
  async getDoctorInfo(@Headers('authorization') authHeader: string) {
    if (!authHeader) { throw new UnauthorizedException('logout'); }
    const authToken = authHeader.split(' ')[1];
    const DoctorData = await this.tokenDoctorService.validateToken(authToken);
    if(DoctorData.error) { throw new HttpException(DoctorData.data, HttpStatus.BAD_REQUEST) }
    return DoctorData;
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    const data = await this.tokenDoctorService.refreshTokens(refreshTokenDto.resetToken);
    if(data.error) { throw new HttpException(data.data, HttpStatus.BAD_REQUEST); }
    return data
  }

    @Patch('/update/notification')
    @UseGuards(DoctorAuthGuard)
    async updateNotification(
      @GetDoctorId() doctorId: string,
      @Body() notificationToken: firebaseTokenDto): Promise<any> {
        const data = await this.authService.updateNotification(doctorId, notificationToken);
        if(data.error) {
          throw new HttpException(data.data, HttpStatus.BAD_REQUEST);
        }
        return data;
    }

    @Patch('/profile/update')
    @UseInterceptors(FileInterceptor('image'))
    @UseGuards(DoctorAuthGuard)
    async updateProfile(@Body() description: descriptionDto, @GetDoctorId() doctorId: string, @UploadedFile() image_user: MulterFile): Promise<any> {
      if(image_user === undefined){
        throw new HttpException("Imagem não enviada", HttpStatus.BAD_REQUEST);
      }
      const create = await this.authService.updateProfile(description, doctorId, image_user);
      if(create.error) {
        throw new HttpException(create.data, HttpStatus.BAD_REQUEST);
      }
      return create;
    }
}