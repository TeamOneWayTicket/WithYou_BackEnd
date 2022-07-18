import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { LocalUser } from './local.user.entity';
import { UpdateUserDto } from './userDto/updateUserDto';
import { CreateUserDto } from './userDto/createUserDto';

@Injectable()
export class UserService {
  //생성자
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(LocalUser)
    private localUserRepository: Repository<LocalUser>,
  ) {}

  //유저 리스트 조회
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  /**
   * 특정 유저 조회
   * @param id
   */
  findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  findOneByEmail(nickname: string): Promise<User> {
    return this.userRepository.findOne({ where: { nickname } });
  }

  /**
   * 유저 수정
   * @param user
   */
  async updateUser(id: number, user: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, user);
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

  /**
   * 유저 삭제
   */
  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete({ id: id });
  }
}
