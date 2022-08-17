import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Family } from './family.entity';
import { CreateFamilyDto } from './familyDto/create-family.dto';

@Injectable()
export class FamilyService {
  constructor(
    @InjectRepository(Family)
    private familyRepository: Repository<Family>,
  ) {}

  async findOne(familyId: number): Promise<Family> {
    return await this.familyRepository.findOne({ where: { id: familyId } });
  }
  // async subFamilyMember();

  // async addFamilyMember(familyId: number, user: User): Promise<Family> {
  //   return await this.familyRepository.findOne({ where: { id: familyId } });
  // }

  async createFamily(familyDto: CreateFamilyDto): Promise<Family> {
    return await this.familyRepository.save(familyDto);
  }

  async updateFamily(familyId: number, familyName: string): Promise<Family> {
    const family: Family = await this.findOne(familyId);
    family.familyName = familyName;
    await this.familyRepository.update(familyId, family);
    return await this.findOne(familyId);
  }

  async deleteFamily(familyId: number): Promise<void> {
    await this.familyRepository.delete({ id: familyId });
  }
}
