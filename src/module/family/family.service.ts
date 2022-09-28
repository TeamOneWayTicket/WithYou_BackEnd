import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Family } from './entity/family.entity';
import { CreateFamilyDto } from './dto/create-family.dto';
import { FamilyInviteCode } from './entity/family.invite.code.entity';
import { FamilyInviteCodeDto } from './dto/family-invite-code.dto';
import crypto from 'crypto';

@Injectable()
export class FamilyService {
  constructor(
    @InjectRepository(Family)
    private familyRepository: Repository<Family>,
    @InjectRepository(FamilyInviteCode)
    private familyInviteCodeRepository: Repository<FamilyInviteCode>,
  ) {}

  async createFamily(dto: CreateFamilyDto): Promise<Family> {
    return await this.familyRepository.save(dto);
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
}
