import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class KakaoUser {
  @PrimaryGeneratedColumn() // 이 Annotation을 통해 기본키로 사용함을 명시함
  kakaoUserid: number;

  @Column()
  @Index()
  kakaoIdx: number;

  @Column({ nullable: true })
  accessToken: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ unique: true })
  @Index()
  userId: number;

  @OneToOne(() => User, (user) => user.kakaoUser)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
