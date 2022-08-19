import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { KakaoUser } from '../../user/kakao.user.entity';
import { User } from '../../user/user.entity';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { KakaoStrategy } from '../strategy/kakao.strategy';
import { UserService } from '../../user/user.service';
import { UpdateUserDto } from '../../user/userDto/update-user.dto';

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

  async register(kakaoId: string, accessToken: string): Promise<KakaoUser> {
    const queryRunner = this.myDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const user = {} as User;
    let kakaoUser: KakaoUser;
    try {
      await this.userRepository.save(user);
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

  async putUserInfo(userId: number, userInfo: UpdateUserDto): Promise<User> {
    return await this.userService.findOne(userId);
  }

  async updateUser(_user: KakaoUser): Promise<KakaoUser> {
    const targetUser: KakaoUser = await this.findKakaoUser(_user.kakaoId);
    const { id, userId, user } = targetUser;
    const { accessToken, refreshToken, kakaoId } = _user;
    const updatedUser: KakaoUser = {
      id,
      accessToken,
      refreshToken,
      kakaoId,
      userId,
      user,
    };

    await this.kakaoUserRepository.update(targetUser.id, updatedUser);
    return updatedUser;
  }
}
