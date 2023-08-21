import { Controller, HttpCode, HttpStatus, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from './public.decorator';
import { User } from 'src/users/users.model';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  singIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password)
  }

  @Public()
  @Post('signup')
  async signUp(
    @Body() signUpDto: Record<string, any>
  ): Promise<User> {
    return this.authService.signUp(signUpDto.email, signUpDto.password)
  }

  @Public()
  @Post('refresh_token')
  async refreshToken(
    @Body('refresh_token') refresh_token: string 
  ): Promise<object> {
    return this.authService.refreshToken(refresh_token)
  }
  
  @Public()
  @Get()
  findAll() {
    return [];
  }


}
