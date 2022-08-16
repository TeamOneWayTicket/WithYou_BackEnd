import { Module } from '@nestjs/common';
import { FamilyService } from './family.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Family } from './family.entity';
import { FamilyController } from './family.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Family]), UserModule],
  controllers: [FamilyController],
  providers: [FamilyService],
  exports: [FamilyService],
})
export class FamilyModule {}
