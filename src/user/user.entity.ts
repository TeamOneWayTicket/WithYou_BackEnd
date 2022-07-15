import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  Index,
  Unique,
  OneToMany,
} from 'typeorm';
import { LocalUser } from './local.user.entity';
import { KakaoUser } from './kakao.user.entity';
import { Diary } from '../diary/diary.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn() // 이 Annotation을 통해 기본키로 사용함을 명시함
  id: number;

  @Column({
    nullable: true,
  })
  @Index()
  familyId: number;

  @Column({
    nullable: true,
  })
  nickname: string;

  @Column({
    nullable: true,
  })
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
