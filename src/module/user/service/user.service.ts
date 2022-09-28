import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { LocalUser } from '../entity/local.user.entity';
import { UserPushToken } from '../entity/user-push-token.entity';
import { SubInfoDto } from '../dto/sub-info.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { FamilyService } from '../../family/family.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(LocalUser)
    private localUserRepository: Repository<LocalUser>,
    @InjectRepository(UserPushToken)
    private readonly pushTokenRepository: Repository<UserPushToken>,
    private readonly familyService: FamilyService,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findByFamilyId(familyId: number): Promise<User[]> {
    return await this.userRepository.find({ where: { familyId } });
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async hasMinimumInfo(id: number): Promise<boolean> {
    const user = await this.findOne(id);
    return !(!user.familyId || !user.role);
  }

  async saveUserPushToken(userId: number, userPushToken: string) {
    const newToken =
      (await this.pushTokenRepository.findOne({
        where: { userId },
      })) ?? this.pushTokenRepository.create({ userId });
    newToken.firebaseToken = userPushToken;

    return this.pushTokenRepository.save(newToken);
  }

  async updateUser(id: number, dto: SubInfoDto): Promise<User> {
    const user = await this.findOne(id);
    user.role = dto.role;
    user.gender = dto.gender;
    user.nickname = dto.nickname;
    return await this.userRepository.save(user);
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    return await this.userRepository.save(dto);
  }

  async deleteUser(id: number): Promise<number | undefined> {
    return (await this.userRepository.delete({ id })).affected;
  }

  async joinFamily(userId: number, code: string): Promise<User> {
    const user = await this.findOne(userId);
    user.familyId = (await this.familyService.getFamily(code)).familyId;
    return await this.userRepository.save(user);
  }
}
