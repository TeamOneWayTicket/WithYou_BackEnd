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
    return await this.googleUserRepository.save({
      googleId,
      email,
      nickname,
    });
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
