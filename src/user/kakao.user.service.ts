import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { KakaoUser } from './kakao.user.entity';

@Injectable()
export class KakaoUserService {
  //생성자
  constructor(
    @InjectRepository(KakaoUser)
    private kakaoUserRepository: Repository<KakaoUser>,
  ) {
    this.kakaoUserRepository = kakaoUserRepository;
  }

  findOne(user_id: number): Promise<KakaoUser> {
    return this.kakaoUserRepository.findOne({
      where: { kakao_userid: user_id },
    });
  }

  /**
   * 유저 수정
   * @param user
   */
  async updateUser(id: number, kakaoUser: KakaoUser): Promise<UpdateResult> {
    return await this.kakaoUserRepository.update(id, kakaoUser);
  }

  /**
   * 유저 저장
   * @param user
   */
  async saveUser(kakaoUser: KakaoUser): Promise<KakaoUser> {
    return await this.kakaoUserRepository.save(kakaoUser);
  }

  /**
   * 유저 삭제
   */
  async deleteUser(id: number): Promise<DeleteResult> {
    return await this.kakaoUserRepository.delete({ kakao_userid: id });
  }
}
