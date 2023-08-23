import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, User_info } from './users.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserDto } from './users.dto';

@Module({
  imports: [TypeOrmModule.forFeature([User, User_info])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
