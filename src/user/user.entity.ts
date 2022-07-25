import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  Index,
  OneToMany,
} from 'typeorm';
import { LocalUser } from './local.user.entity';
import { KakaoUser } from './kakao.user.entity';
import { Diary } from '../diary/diary.entity';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

@Entity()
@ApiExtraModels()
export class User {
  @PrimaryGeneratedColumn() // 이 Annotation을 통해 기본키로 사용함을 명시함
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

  @Column({
    nullable: true,
  })
  @ApiModelProperty({ description: '성별' })
  gender: string;

  @OneToOne(() => LocalUser, (localUser) => localUser.user, {
    nullable: true,
  })
  localUser: LocalUser;

  @OneToOne(() => KakaoUser, (kakaoUser) => kakaoUser.user, {
    nullable: true,
  })
  kakaoUser: KakaoUser;

  @OneToMany(() => Diary, (diary) => diary.author)
  diarys: Diary[];
}
