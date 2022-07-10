import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { LocalUser } from './local.user.entity';
import { KakaoUser } from './kakao.user.entity';

@Object
@Entity()
export class User {
  @PrimaryGeneratedColumn() // 이 Annotation을 통해 기본키로 사용함을 명시함
  id: number;

  @Column()
  family_idx: number;

  @Column({ nullable: false })
  nickname: string;

  @Column({ nullable: false })
  gender: string;

  @OneToOne(() => LocalUser, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'userid' })
  local_user: LocalUser;

  @OneToOne(() => KakaoUser, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'kakao_userid' })
  kakao_user: KakaoUser;
}
