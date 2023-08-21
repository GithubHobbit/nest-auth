import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { Delete, Put, UseGuards } from "@nestjs/common/decorators";
import { UsersService } from './users.service';
import { User, User_info } from './users.model';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.email)
  }

  @UseGuards(AuthGuard)
  @Put('profile')
  saveProfile(@Request() req, @Body() user: object) {
    return this.usersService.update(req.user.sub, user)
  }

  @UseGuards(AuthGuard)
  @Post('create_info')
  createInfo(
    @Request() req, 
    @Body('new_info') new_info: string
  ): Promise<User_info> {
    return this.usersService.createOneInfo(req.user.email, new_info)
  }

  @UseGuards(AuthGuard)
  @Delete('delete_info')
  deleteInfo(@Request() req, @Body('id_info') id_info: number): Promise<any> {
    return this.usersService.deleteOneInfo(req.user.sub, id_info)
  }

  @UseGuards(AuthGuard)
  @Put('update_info')
  updateInfo(
    @Request() req, 
    @Body('id_info') id_info: number,
    @Body('content_info') content_info: string
  ): Promise<any> {
    return this.usersService.updateOneInfo(req.user.sub, id_info, content_info)
  }

}
