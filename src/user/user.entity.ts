import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { LocalUser } from './local.user.entity';
import { KakaoUser } from './kakao.user.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn() // 이 Annotation을 통해 기본키로 사용함을 명시함
  id: number;

  @Column()
  @Index()
  familyId: number;

  @Column()
  nickname: string;

  @Column()
  gender: string;

  @OneToOne(() => LocalUser, (localUser) => localUser.user, {
    nullable: true,
  })
  localUser: LocalUser;

  @OneToOne(() => KakaoUser, (kakaoUser) => kakaoUser.user, {
    nullable: true,
  })
  kakaoUser: KakaoUser;
}
