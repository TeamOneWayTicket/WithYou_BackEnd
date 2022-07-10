import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { LocalUser } from './local.user.entity';

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

  @OneToOne(() => LocalUser)
  @JoinColumn({ name: 'userid' })
  local_user: LocalUser;
}
