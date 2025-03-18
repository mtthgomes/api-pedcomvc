import { Controller, Post, Body, HttpStatus, UnauthorizedException, Get, Headers, HttpException, Patch, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidatorLoginUseCase } from 'src/shared/validators/login-use-case';
import { LoginDto } from '@app/shared/dtos/auth/login.Dto';
import { RefreshTokenDto } from '@app/shared/dtos/auth/refreshToken.Dto';
import { TokenUserService } from './user.guard';
import { CreateUserDto } from '@app/shared/dtos/auth/createUser.dto';
import { firebaseTokenDto } from './dto/firebase.dto';
import { UserAuthGuard } from '@app/shared/guards/user-auth.guard';
import { GetUserId } from '@app/shared/decorator/get-user-id.decorator';

@Controller('user/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenUserService: TokenUserService,
    private readonly validator: ValidatorLoginUseCase
  ) {}

  @Post('signup')
  async create(@Body() userDto: CreateUserDto): Promise<any> {
    const create = await this.authService.createUser(userDto);
    if(create.error) { throw new HttpException(create.data, HttpStatus.BAD_REQUEST); }
    return create;
  }

  @Post('login/email')
  async login(@Body() loginDto: LoginDto) {
    const validator = await this.validator.execute(loginDto);
    if(validator.error){ throw new HttpException(validator.data, HttpStatus.BAD_REQUEST) }
    const login = await this.authService.validateUser(loginDto.email, loginDto.password);
    if(login.error) { throw new HttpException(login.data, HttpStatus.BAD_REQUEST); }
    return login;
  }

  @Post('login/google')
  async login_google(@Body() loginDto: LoginDto) {
    const validator = await this.validator.execute(loginDto);
    if(validator.error){ throw new HttpException(validator.data, HttpStatus.BAD_REQUEST) }
    const login = await this.authService.validateUser(loginDto.email, loginDto.password);
    if(login.error) { throw new HttpException(login.data, HttpStatus.BAD_REQUEST); }
    return login;
  }

  @Post('login/apple')
  async login_apple(@Body() loginDto: LoginDto) {
    const validator = await this.validator.execute(loginDto);
    if(validator.error){ throw new HttpException(validator.data, HttpStatus.BAD_REQUEST) }
    const login = await this.authService.validateUser(loginDto.email, loginDto.password);
    if(login.error) { throw new HttpException(login.data, HttpStatus.BAD_REQUEST); }
    return login;
  }

  @Get('info')
  async getUserInfo(@Headers('authorization') authHeader: string) {
    if (!authHeader) { throw new UnauthorizedException('logout'); }
    const authToken = authHeader.split(' ')[1];
    const userData = await this.tokenUserService.validateToken(authToken);
    if(userData.error) { throw new HttpException(userData.data, HttpStatus.BAD_REQUEST) }
    return userData;
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    const data = await this.tokenUserService.refreshTokens(refreshTokenDto.resetToken);
    if(data.error) { throw new HttpException(data.data, HttpStatus.BAD_REQUEST); }
    return data
  }

  @Patch('/update/notification')
  @UseGuards(UserAuthGuard)
  async updateNotification(@GetUserId() userId: string, @Body() notificationToken: firebaseTokenDto): Promise<any> {
      const data = await this.authService.updateNotification(userId, notificationToken);
      if(data.error) {
        throw new HttpException(data.data, HttpStatus.BAD_REQUEST);
      }
      return data;
  }
}