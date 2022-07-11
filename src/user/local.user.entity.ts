import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class LocalUser {
  @PrimaryGeneratedColumn() // 이 Annotation을 통해 기본키로 사용함을 명시함
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  @Index()
  userId: number;

  @OneToOne(() => User, (user) => user.localUser)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
