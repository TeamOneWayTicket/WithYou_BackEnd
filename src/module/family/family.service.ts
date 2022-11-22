import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, Repository } from 'typeorm';
import { Family } from './entity/family.entity';
import { CreateFamilyDto } from './dto/create-family.dto';
import { FamilyInviteCode } from './entity/family.invite.code.entity';
import { FamilyInviteCodeDto } from './dto/family-invite-code.dto';
import crypto from 'crypto';
import { User } from '../user/entity/user.entity';
import { ChronoUnit, LocalDateTime } from '@js-joda/core';
import { FamilySubject } from './entity/family.subject.entity';
import { FamilySubjectResponseDto } from './dto/family-subject-response.dto';

@Injectable()
export class FamilyService {
  constructor(
    @InjectRepository(Family)
    private familyRepository: Repository<Family>,

    @InjectRepository(FamilyInviteCode)
    private familyInviteCodeRepository: Repository<FamilyInviteCode>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(FamilySubject)
    private familySubjectRepository: Repository<FamilySubject>,
    private readonly myDataSource: DataSource,
  ) {}

  async createFamily(userId: number, dto: CreateFamilyDto): Promise<Family> {
    const queryRunner = this.myDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const family = await this.familyRepository.save(dto);
      const user = await this.userRepository.findOne({ where: { id: userId } });
      user.familyId = family.id;
      await this.userRepository.save(user);
      await queryRunner.commitTransaction();
      return family;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getFamilyTodaySubject(
    familyId: number,
  ): Promise<FamilySubjectResponseDto> {
    return await this.familySubjectRepository.findOne({
      where: {
        familyId,
        createdAt: Between(
          LocalDateTime.now().truncatedTo(ChronoUnit.DAYS).minusDays(1),
          LocalDateTime.now().truncatedTo(ChronoUnit.DAYS),
        ),
      },
    });
  }

  async getFamilySubject(
    familyId: number,
    day: LocalDateTime,
  ): Promise<FamilySubjectResponseDto> {
    return await this.familySubjectRepository.findOne({
      where: {
        familyId,
        createdAt: Between(
          day.truncatedTo(ChronoUnit.DAYS).minusDays(1),
          day.truncatedTo(ChronoUnit.DAYS),
        ),
      },
    });
  }

  async updateFamily(id: number, name: string): Promise<Family> {
    return await this.familyRepository.save({ id, name });
  }

  async deleteFamily(id: number): Promise<void> {
    await this.familyRepository.delete({ id });
  }

  async getInviteCode(familyId: number): Promise<FamilyInviteCodeDto> {
    const inviteCode = crypto.randomBytes(5).toString('hex');
    await this.familyInviteCodeRepository.save({
      familyId,
      inviteCode,
    });

    return { inviteCode };
  }

  async getFamily(inviteCode: string): Promise<FamilyInviteCode> {
    return await this.familyInviteCodeRepository.findOne({
      where: { inviteCode },
    });
  }

  async isValidCode(inviteCode: string): Promise<boolean> {
    const code = await this.familyInviteCodeRepository.findOne({
      where: { inviteCode },
    });

    if (!code) {
      return false;
    }
    const curTime = LocalDateTime.now().minusMinutes(10);
    const expireTime = code.createdAt;
    return curTime.isBefore(expireTime);
  }
}
