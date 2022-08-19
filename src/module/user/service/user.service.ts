import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { LocalUser } from '../entity/local.user.entity';
import { UserPushToken } from '../entity/user-push-token.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { Family } from '../../family/entity/family.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(LocalUser)
    private localUserRepository: Repository<LocalUser>,
    @InjectRepository(UserPushToken)
    private readonly pushTokenRepository: Repository<UserPushToken>,
    @InjectRepository(Family)
    private familyRepository: Repository<Family>,
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

  async updateUser(id: number, user: UpdateUserDto): Promise<User> {
    const family = await this.familyRepository.findOne({
      where: { id: user.familyId },
    });
    const updateInfo = {
      family,
      ...user,
    };
    await this.userRepository.update(id, updateInfo);
    return await this.findOne(id);
  }

  async createUser(user: CreateUserDto): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findLocalUser(userId: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ['local_user'],
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete({ id: id });
  }
}
