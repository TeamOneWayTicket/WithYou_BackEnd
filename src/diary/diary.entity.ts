import {
  Column,
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

  @Column()
  date: Date;

  @Column()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.diarys, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'author_id' })
  author: User;
}
