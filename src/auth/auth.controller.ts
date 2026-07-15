import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth') // http://localhost:3001/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login') // http://localhost:3001/auth/login
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}