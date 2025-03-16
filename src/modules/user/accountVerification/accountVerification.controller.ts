import { Controller, Post, Body, HttpException, HttpStatus, UseGuards} from '@nestjs/common';
import { UserAccountValidationService } from './accountVerification.service';
import { AccountVerificationDto } from './dto/create.dto';
import { UserAuthGuard } from '@app/shared/guards/user-auth.guard';
import { GetUserId } from '@app/shared/decorator/get-user-id.decorator';

@Controller('user/account_verification')
@UseGuards(UserAuthGuard)
export class UserAccountValidationController {
  constructor(
    private readonly accountVerificationService: UserAccountValidationService,
  ) {}

  @Post('/create')
  async create(@Body() accountVerificationDto: AccountVerificationDto, @GetUserId() userId: string): Promise<any> {
    const create = await this.accountVerificationService.create(accountVerificationDto, userId);
    if(create.error) {
      throw new HttpException(create.data, HttpStatus.BAD_REQUEST);
    }
    return create;
  }

  @Post('/send-again')
  async sendAgain(@GetUserId() userId: string): Promise<any> {
    const validate = await this.accountVerificationService.sendAgain(userId);
    if(validate.error) {
      throw new HttpException(validate.data, HttpStatus.BAD_REQUEST);
    }
    return validate;
  }

  @Post('/validate')
  async validate(@Body() accountVerificationDto: AccountVerificationDto, @GetUserId() userId: string): Promise<any> {
    const create = await this.accountVerificationService.validate(accountVerificationDto, userId);
    if(create.error) {
      throw new HttpException(create.data, HttpStatus.BAD_REQUEST);
    }
    return create;
  }
}