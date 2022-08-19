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
  @PrimaryGeneratedColumn()
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
