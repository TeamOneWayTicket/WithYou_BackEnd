import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { KakaoUser } from '../../user/entity/kakao.user.entity';
import { User } from '../../user/entity/user.entity';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { KakaoStrategy } from '../strategy/kakao.strategy';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class KakaoAuthService {
  constructor(
    @InjectRepository(KakaoUser)
    private readonly kakaoUserRepository: Repository<KakaoUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly myDataSource: DataSource,
    private readonly configService: ApiConfigService,
  ) {}

  async findKakaoUser(kakaoId: string): Promise<KakaoUser> {
    return await this.kakaoUserRepository.findOne({
      where: { kakaoId },
    });
  }

  async findKakaoUserByUserId(userId: number): Promise<KakaoUser> {
    return await this.kakaoUserRepository.findOne({
      where: { userId },
    });
  }

  async getKakaoProfile(accessToken: string) {
    return new Promise<any>((resolve, reject) => {
      new KakaoStrategy(this.configService).userProfile(
        accessToken,
        (error, user) => {
          if (error) {
            return reject(error);
          } else {
            return resolve(user);
          }
        },
      );
    });
  }

  async register(
    kakaoId: string,
    accessToken: string,
    thumbnail: string,
  ): Promise<KakaoUser> {
    const queryRunner = this.myDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let kakaoUser: KakaoUser;
    try {
      const user = await this.userRepository.save({
        vendor: 'kakao',
        thumbnail,
      });
      kakaoUser = await this.kakaoUserRepository.save({
        userId: user.id,
        accessToken,
        kakaoId,
      });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return kakaoUser;
  }
}
