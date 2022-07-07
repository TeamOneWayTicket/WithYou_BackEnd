import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  //생성자
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    this.userRepository = userRepository;
  }

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

  findOneByUserId(userId: string): Promise<User> {
    return this.userRepository.findOne({ where: { userId } });
  }

  /**
   * 유저 수정
   * @param user
   */
  async updateUser(id: number, user: User): Promise<void> {
    await this.userRepository.update(id, user);
  }
  /**
   * 유저 저장
   * @param user
   */
  async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }
  /**
   * 유저 삭제
   */
  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete({ id: id });
  }
}
