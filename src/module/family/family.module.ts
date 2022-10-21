import { Module } from '@nestjs/common';
import { FamilyService } from './family.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from './entity/family.entity';
import { FamilyController } from './controller/family.controller';
import { UserModule } from '../user/user.module';
import { FamilyInviteCode } from './entity/family.invite.code.entity';
import { User } from '../user/entity/user.entity';
import { FamilySubject } from './entity/family.subject.entity';
import { FamilySubjectController } from './controller/family.subject.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Family, FamilyInviteCode, User, FamilySubject]),
    UserModule,
  ],
  controllers: [FamilyController, FamilySubjectController],
  providers: [FamilyService],
  exports: [FamilyService],
})
export class FamilyModule {}
