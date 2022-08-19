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

  async createFamily(dto: CreateFamilyDto): Promise<Family> {
    return await this.familyRepository.save(dto);
  }

  async updateFamily(id: number, name: string): Promise<Family> {
    return await this.familyRepository.save({ id, name });
  }

  async deleteFamily(id: number): Promise<void> {
    await this.familyRepository.delete({ id });
  }
}
