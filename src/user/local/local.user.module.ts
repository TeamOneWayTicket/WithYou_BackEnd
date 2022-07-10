import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { LocalUser } from '../../entity/local.user.entity';
import { UserController } from '../user.controller';
import { LocalUserController } from './local.user.controller';
import { UserService } from '../user.service';
import { LocalUserService } from './local.user.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocalUser])],
  controllers: [LocalUserController],
  providers: [LocalUserService],
  exports: [LocalUserService],
})
export class LocalUserModule {}
