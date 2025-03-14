import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException, Get, Headers, HttpException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidatorLoginUseCase } from 'src/shared/validators/login-use-case';
import { LoginDto } from '@app/shared/dtos/auth/login.Dto';
import { RefreshTokenDto } from '@app/shared/dtos/auth/refreshToken.Dto';
import { TokenAdminService } from './admin.guard';
import { CreateUserDto } from '@app/shared/dtos/auth/createUser.dto';

@Controller('admin/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenAdminService: TokenAdminService,
    private readonly validator: ValidatorLoginUseCase
  ) {}

  @Post('signup')
  async create(@Body() adminDto: CreateUserDto): Promise<any> {
    const create = await this.authService.create(adminDto);
    if(create.error) {
      throw new BadRequestException(create.data);
    }
    return create;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
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
    const userData = await this.tokenAdminService.validateToken(authToken);
    if(userData.error) { throw new HttpException(userData.data, HttpStatus.BAD_REQUEST) }
    return userData;
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    const data = await this.tokenAdminService.refreshTokens(refreshTokenDto.resetToken);
    if(data.error) { throw new HttpException(data.data, HttpStatus.BAD_REQUEST); }
    return data
  }

  @Get('list')
  async list() {
    const data = await this.authService.list();
    if(data.error) { throw new HttpException(data.data, HttpStatus.BAD_REQUEST); }
    return data
  }
}