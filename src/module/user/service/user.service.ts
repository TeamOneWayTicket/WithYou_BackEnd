import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { UserPushToken } from '../entity/user-push-token.entity';
import { SubInfoDto } from '../dto/sub-info.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { FamilyService } from '../../family/family.service';
import AWS from 'aws-sdk';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { v4 as uuid } from 'uuid';
import { ProfileResponseDto } from '../dto/profile-response.dto';
import { ProfileUploadResponseDto } from '../dto/profileUpload-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserPushToken)
    private readonly pushTokenRepository: Repository<UserPushToken>,
    private readonly familyService: FamilyService,
    private readonly configService: ApiConfigService,
  ) {
    AWS.config.update({
      region: this.configService.awsConfig.bucketRegion,
      accessKeyId: this.configService.awsConfig.accessKey,
      secretAccessKey: this.configService.awsConfig.secretAccessKey,
    });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findByFamilyId(familyId: number): Promise<User[]> {
    return await this.userRepository.find({ where: { familyId } });
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async hasMinimumInfo(id: number): Promise<boolean> {
    const user = await this.findOne(id);
    return !(!user.familyId || !user.role);
  }

  async saveUserPushToken(userId: number, userPushToken: string) {
    const newToken =
      (await this.pushTokenRepository.findOne({
        where: { userId },
      })) ?? this.pushTokenRepository.create({ userId });
    newToken.firebaseToken = userPushToken;

    return this.pushTokenRepository.save(newToken);
  }

  async getUrlsForUpload(fileType: string): Promise<ProfileUploadResponseDto> {
    const s3 = new AWS.S3({ useAccelerateEndpoint: true });

    const fileName = `profile/${uuid()}.${fileType}`;
    const s3Url = await s3.getSignedUrlPromise('putObject', {
      Bucket: this.configService.awsConfig.bucketName,
      Key: fileName,
      Expires: 3600,
    });

    return { s3Url, fileName };
  }

  async saveProfile(id: number, fileName: string): Promise<void> {
    await this.userRepository.update(id, { thumbnail: fileName });
  }

  async getProfileUrl(id: number): Promise<ProfileResponseDto> {
    const s3 = new AWS.S3({ useAccelerateEndpoint: true });

    return {
      s3Url: await s3.getSignedUrlPromise('getObject', {
        Bucket: this.configService.awsConfig.bucketName,
        Key: (await this.findOne(id)).thumbnail,
        Expires: 3600,
      }),
    };
  }

  async updateUser(id: number, dto: SubInfoDto): Promise<User> {
    await this.userRepository.update(id, {
      role: dto.role,
      gender: dto.gender,
      nickname: dto.nickname,
    });
    return await this.findOne(id);
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    return await this.userRepository.save(dto);
  }

  async deleteUser(id: number): Promise<number | undefined> {
    return (await this.userRepository.delete({ id })).affected;
  }

  async joinFamily(userId: number, code: string): Promise<void> {
    await this.userRepository.update(userId, {
      familyId: (await this.familyService.getFamily(code)).familyId,
    });
  }
}
