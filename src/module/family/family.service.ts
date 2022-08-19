import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Family } from './entity/family.entity';
import { CreateFamilyDto } from './dto/create-family.dto';

@Injectable()
export class FamilyService {
  constructor(
    @InjectRepository(Family)
    private familyRepository: Repository<Family>,
  ) {}

  async findOne(familyId: number): Promise<Family> {
    return await this.familyRepository.findOne({ where: { id: familyId } });
  }

  async createFamily(dto: CreateFamilyDto): Promise<Family> {
    return await this.familyRepository.save(dto);
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