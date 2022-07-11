import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { LocalUser } from './local.user.entity';
import { KakaoUser } from './kakao.user.entity';

@Object
@Entity()
@Index(['familyIdx'])
export class User {
  @PrimaryGeneratedColumn() // 이 Annotation을 통해 기본키로 사용함을 명시함
  id: number;

  @Column()
  familyId: number;

  @Column()
  nickname: string;

  @Column()
  gender: string;

  @OneToOne(() => LocalUser, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'userid' })
  localUser: LocalUser;

  @OneToOne(() => KakaoUser, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'kakao_userid' })
  kakaoUser: KakaoUser;
}
