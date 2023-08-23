import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, User_info } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(User_info)
    private userInfoRepository: Repository<User_info>
  ) {}

  async create(email: string, password: string): Promise<User> {
    return this.usersRepository.save({
      email,
      password,
    })
  }

  async findOne(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email },
      relations: {
        info: true
      }
    })
  }

  async createOneInfo(email: string, new_info: string) {
    const current_user = await this.usersRepository.findOneBy({email})
    const info_object = new User_info()
    info_object.user = current_user
    info_object.info = new_info

    return await this.userInfoRepository.save(info_object)
  }

  async deleteOneInfo(user_id: number, id_info: number): Promise<any> {
    let info = await this.userInfoRepository.findOne({
      where: {id: id_info},
      relations: {
        user: true
      }
    })
    if(info.user.id === user_id) {
      return await this.userInfoRepository.delete(id_info)
    }
    else throw new ForbiddenException()
  }

  async updateOneInfo(user_id: number, id_info: number, content_info: string): Promise<User_info> {
    let info = await this.userInfoRepository.findOne({
      where: {id: id_info},
      relations: {
        user: true
      }
    })
    if(info.user.id === user_id) {
      info.info = content_info
      return await this.userInfoRepository.save(info)
    }
    else throw new ForbiddenException()
  }

  async update(id: number, user: object): Promise<void> {
    console.log(user)
    await this.usersRepository.update(id, user);
  }  
}
