import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { UserController } from './user.controller';
import { LocalUserService } from './local/local.user.service';
import { LocalUser } from '../entity/local.user.entity';
import { LocalUserController } from './local/local.user.controller';
import { LocalUserModule } from './local/local.user.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, LocalUser]), LocalUserModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
