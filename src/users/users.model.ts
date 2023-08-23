import { Module } from '@nestjs/common';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Column({nullable: true})
  name: string;
  
  @Column({nullable: true})
  phone: string;
  
  @Column({nullable: true})
  address: string;

  @OneToMany(() => User_info, (info) => info.user)
  info: User_info[];

  @Column({nullable: true})
  refresh_token: string;
}

@Entity()
export class User_info {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.info)
  user: User

  @Column()
  info: string;
}