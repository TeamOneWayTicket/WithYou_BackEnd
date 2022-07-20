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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Diary {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'id' })
  id: number;

  @Column({
    nullable: true,
  })
  @Index()
  @ApiProperty({ description: '가족 id' })
  familyId: number;

  @Column()
  @Index()
  @ApiProperty({ description: '일기장 쓴 사람의 id' })
  authorId: number;

  @Column({
    nullable: true,
  })
  @ApiProperty({ description: '일기장 내용' })
  content: string;

  @CreateDateColumn()
  @Index()
  @ApiProperty({ description: '일기장 작성 시점' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.diarys, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'author_id' })
  author: User;
}
