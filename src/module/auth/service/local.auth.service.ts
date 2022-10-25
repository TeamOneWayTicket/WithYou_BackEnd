import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { LocalUser } from '../../user/entity/local.user.entity';
import { CreateLocalUserDto } from '../../user/dto/create-local.user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalAuthService {
  constructor(
    private readonly configService: ApiConfigService,
    @InjectRepository(LocalUser)
    private readonly localUserRepository: Repository<LocalUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly myDataSource: DataSource,
  ) {}

  async register(dto: CreateLocalUserDto): Promise<LocalUser> {
    const queryRunner = this.myDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let localUser: LocalUser;
    try {
      const user = await this.userRepository.save({
        vendor: 'local',
      });
      localUser = await this.localUserRepository.save({
        userId: user.id,
        email: dto.email,
        password: await bcrypt.hash(dto.password, 10),
      });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return localUser;
  }
}
