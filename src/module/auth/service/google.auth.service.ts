import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/entity/user.entity';
import { GoogleUser } from '../../user/entity/google.user.entity';
import { GoogleStrategy } from '../strategy/google.strategy';
import { ApiConfigService } from '../../../shared/services/api-config.service';

@Injectable()
export class GoogleAuthService {
  constructor(
    @InjectRepository(GoogleUser)
    private readonly googleUserRepository: Repository<GoogleUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly myDataSource: DataSource,
    private readonly configService: ApiConfigService,
  ) {}

  async findGoogleUser(googleId: string): Promise<GoogleUser> {
    return await this.googleUserRepository.findOne({
      where: { googleId },
    });
  }

  async getGoogleProfile(accessToken: string) {
    return new Promise<any>((resolve, reject) => {
      new GoogleStrategy(this.configService).userProfile(
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
    googleId: string,
    email: string,
    nickname: string,
    accessToken: string,
    thumbnail: string,
  ): Promise<GoogleUser> {
    const queryRunner = this.myDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let googleUser: GoogleUser;
    try {
      const user = await this.userRepository.save({
        vendor: 'google',
        thumbnail,
      });
      googleUser = await this.googleUserRepository.save({
        userId: user.id,
        googleId,
        email,
        nickname,
        accessToken,
      });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return googleUser;
  }
}
