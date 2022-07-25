import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { GoogleUser } from '../../user/google.user.entity';

@Injectable()
export class GoogleAuthService {
  constructor(
    @InjectRepository(GoogleUser)
    private googleUserRepository: Repository<GoogleUser>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private myDataSource: DataSource,
  ) {}

  async findGoogleUser(googleId: string): Promise<GoogleUser> {
    return await this.googleUserRepository.findOne({
      where: { googleId },
    });
  }

  async register(
    googleId: string,
    email: string,
    nickname: string,
  ): Promise<GoogleUser> {
    const queryRunner = this.myDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const user = {} as User;
    let googleUser: GoogleUser;
    try {
      await this.userRepository.save(user);
      googleUser = await this.googleUserRepository.save({
        user,
        userId: user.id,
        googleId,
        email,
        nickname,
      });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return googleUser;
  }

  async login(user: GoogleUser): Promise<GoogleUser> {
    const existUser: GoogleUser = await this.validateUser(user.googleId);

    if (!existUser) {
      return this.register(user.googleId, user.nickname, user.email);
    } else {
      return existUser;
    }
  }

  async validateUser(googleId: string): Promise<GoogleUser> {
    return await this.findGoogleUser(googleId);
  }
}
