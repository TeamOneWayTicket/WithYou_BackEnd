import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Family } from './entity/family.entity';
import { CreateFamilyDto } from './dto/create-family.dto';
import { FamilyInviteCode } from './entity/family.invite.code.entity';
import { FamilyInviteCodeDto } from './dto/family-invite-code.dto';
import crypto from 'crypto';
import { User } from '../user/entity/user.entity';
import { LocalDateTime } from '@js-joda/core';

@Injectable()
export class FamilyService {
  constructor(
    @InjectRepository(Family)
    private familyRepository: Repository<Family>,
    @InjectRepository(FamilyInviteCode)
    private familyInviteCodeRepository: Repository<FamilyInviteCode>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
