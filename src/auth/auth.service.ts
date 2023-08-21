import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService  
  ) {}
  
  async signIn(email: string,  pass: string): Promise<any> {
    const user = await this.usersService.findOne(email)
    const passwordValid = await compare(user.password, pass)
    if (passwordValid) {
      throw new UnauthorizedException()
    }

    const payload = {sub: user.id, email: user.email}
    const refresh_token = await this.jwtService.signAsync(payload, { expiresIn: '30d' })
    user.refresh_token = refresh_token;
    
    await this.usersService.update(user.id, {refresh_token});

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token
    }
  }

  async signUp(email: string, password: string): Promise<User> {
    const saltOrRounds = 10;
    const hashedPassword = await hash(password, saltOrRounds);
    return await this.usersService.create(email, hashedPassword)
  }

  async refreshToken(refresh_token: string): Promise<object> {
    const payload = await this.jwtService.decode(refresh_token) as { [key: string]: any }
    const user = await this.usersService.findOne(payload.email)
    const new_refresh_token = await this.jwtService.signAsync(payload, { expiresIn: '30d' })
    user.refresh_token = refresh_token;
    await this.usersService.update(user.id, {refresh_token});

    return {
      access_token: await this.jwtService.signAsync(payload),
      new_refresh_token
    }
  }

  
}
