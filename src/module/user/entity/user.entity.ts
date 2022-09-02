import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  Index,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LocalUser } from './local.user.entity';
import { KakaoUser } from './kakao.user.entity';
import { Diary } from '../../diary/entity/diary.entity';
import { ApiExtraModels } from '@nestjs/swagger';
import { GoogleUser } from './google.user.entity';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Role } from '../../../common/enum/role.enum';
import { Family } from '../../family/entity/family.entity';
import { AppleUser } from './apple.user.entity';

@Entity()
@ApiExtraModels()
export class User {
  public roles = [Role.User];

  @PrimaryGeneratedColumn()
  @ApiModelProperty({ description: 'id' })
  id: number;

  @Column({
    nullable: true,
  })
  @Index()
  @ApiModelProperty({ description: '가족 id' })
  familyId: number;

  @Column({
    nullable: true,
  })
  @ApiModelProperty({ description: '닉네임' })
  nickname: string;

  @Column()
  @Index()
  @ApiModelProperty({ description: '가입 경로' })
  vendor: 'kakao' | 'google' | 'apple';

  @Column({
    default: '',
  })
  @ApiModelProperty({ description: '썸네일' })
  thumbnail: string;

  @Column({
    nullable: true,
  })
  @ApiModelProperty({ description: '성별' })
  gender: string;

  @Column({
    nullable: true,
  })
  @ApiModelProperty({ description: '역할' })
  role: string;

  @OneToOne(() => LocalUser, (localUser) => localUser.user)
  localUser: LocalUser;

  @OneToOne(() => KakaoUser, (kakaoUser) => kakaoUser.user)
  kakaoUser: KakaoUser;

  @OneToOne(() => GoogleUser, (googleUser) => googleUser.user)
  googleUser: GoogleUser;

  @OneToOne(() => AppleUser, (appleUser) => appleUser.user)
  appleUser: AppleUser;

  @OneToMany(() => Diary, (diary) => diary.author)
  diaries: Diary[];

  @ManyToOne(() => Family, (family) => family.users, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'family_id' })
  family: Family;
}
