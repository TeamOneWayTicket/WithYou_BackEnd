import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Diary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  @Index()
  familyId: number;

  @Column()
  @Index()
  authorId: number;

  @Column({
    nullable: true,
  })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.diarys, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'author_id' })
  author: User;
}
