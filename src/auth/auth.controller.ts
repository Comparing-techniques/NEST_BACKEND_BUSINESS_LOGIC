import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() signUpDto: SignUpDto) {
    return await this.authService.register(signUpDto);
  }

  @Post('/login')
  async login(@Body() signInDto: SignInDto) {
    return await this.authService.login(signInDto);
  }
}
