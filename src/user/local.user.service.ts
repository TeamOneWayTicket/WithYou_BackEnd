import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocalUser } from './local.user.entity';

@Injectable()
export class LocalUserService {
  //생성자
  constructor(
    @InjectRepository(LocalUser)
    private localUserRepository: Repository<LocalUser>,
  ) {
    this.localUserRepository = localUserRepository;
  }

  findOne(user_id: number): Promise<LocalUser> {
    return this.localUserRepository.findOne({ where: { user_id } });
  }

  /**
   * 유저 수정
   * @param user
   */
  async updateUser(id: number, localUser: LocalUser): Promise<void> {
    await this.localUserRepository.update(id, localUser);
  }

  /**
   * 유저 저장
   * @param user
   */
  async saveUser(localUser: LocalUser): Promise<LocalUser> {
    return await this.localUserRepository.save(localUser);
  }

  /**
   * 유저 삭제
   */
  async deleteUser(id: number): Promise<void> {
    await this.localUserRepository.delete({ user_id: id });
  }
}
