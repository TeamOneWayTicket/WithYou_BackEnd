import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { UserService } from '../../user/service/user.service';
import { AppleUser } from '../../user/entity/apple.user.entity';

@Injectable()
export class AppleAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AppleUser)
    private readonly appleUserRepository: Repository<AppleUser>,
    private readonly userService: UserService,
    private readonly myDataSource: DataSource,
  ) {}

  async findAppleUserByUserEmail(email: string): Promise<AppleUser> {
    return await this.appleUserRepository.findOne({
      where: { email },
    });
  }

  async register(
    email: string,
    accessToken: string,
    thumbnail: string,
  ): Promise<AppleUser> {
    const queryRunner = this.myDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let appleUser: AppleUser;
    try {
      const user = await this.userRepository.save({
        vendor: 'apple',
        thumbnail,
      });
      appleUser = await this.appleUserRepository.save({
        userId: user.id,
        accessToken,
        email,
      });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return appleUser;
  }
}
