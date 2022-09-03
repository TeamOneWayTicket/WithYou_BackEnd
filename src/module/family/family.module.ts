import { Module } from '@nestjs/common';
import { FamilyService } from './family.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from './entity/family.entity';
import { FamilyController } from './family.controller';
import { UserModule } from '../user/user.module';
import { FamilyInviteCode } from './entity/family.invite.code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Family, FamilyInviteCode]), UserModule],
  controllers: [FamilyController],
  providers: [FamilyService],
  exports: [FamilyService],
})
export class FamilyModule {}
