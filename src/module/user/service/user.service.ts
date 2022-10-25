import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { UserPushToken } from '../entity/user-push-token.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { FamilyService } from '../../family/family.service';
import AWS from 'aws-sdk';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { v4 as uuid } from 'uuid';
import { ProfileResponseDto } from '../dto/profile-response.dto';
import { ProfileUploadResponseDto } from '../dto/profileUpload-response.dto';
import { ProfileDto } from '../dto/profile.dto';
import { getUrl } from '../../../transformer/url.transformer';

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

  async getUrlsForUpload(
    fileType: string,
    id: number,
  ): Promise<ProfileUploadResponseDto> {
    const s3 = new AWS.S3({ useAccelerateEndpoint: true });

    const fileName = `profile/${id}/${uuid()}.${fileType}`;
    const s3Url = await s3.getSignedUrlPromise('putObject', {
      Bucket: this.configService.awsConfig.bucketName,
      Key: 'origins/' + fileName,
      Expires: 3600,
    });

    return { s3Url, fileName };
  }

  async saveProfile(id: number, dto: ProfileDto): Promise<ProfileResponseDto> {
    await this.userRepository.update(id, {
      role: dto.role,
      gender: dto.gender,
      nickname: dto.nickname,
      thumbnail: dto.fileName,
    });
    return { s3Url: getUrl(dto.fileName, 480) };
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    return await this.userRepository.save(dto);
  }

  async registerUser(dto: ProfileDto): Promise<User> {
    return await this.userRepository.save(dto);
  }

  async deleteUser(id: number): Promise<number | undefined> {
    return (await this.userRepository.delete({ id })).affected;
  }

  async joinFamily(id: number, code: string): Promise<void> {
    await this.userRepository.update(id, {
      familyId: (await this.familyService.getFamily(code)).familyId,
    });
  }
}
