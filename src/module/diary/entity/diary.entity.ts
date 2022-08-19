import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/user.entity';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { DiaryMedium } from './diary.medium.entity';

@Entity()
@ApiExtraModels()
export class Diary {
  @PrimaryGeneratedColumn()
  @ApiModelProperty({ description: 'id' })
  id: number;

  @Column({
    nullable: true,
  })
  @Index()
  @ApiModelProperty({ description: '가족 id' })
  familyId: number;

  @Column()
  @Index()
  @ApiModelProperty({ description: '일기장 쓴 사람의 id' })
  authorId: number;

  @Column({
    nullable: true,
  })
  @ApiModelProperty({ description: '일기장 내용' })
  content: string;

  @CreateDateColumn()
  @Index()
  @ApiModelProperty({ description: '일기장 작성 시점' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.diarys, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany(() => DiaryMedium, (diaryMedium) => diaryMedium.diary)
  media: DiaryMedium[];
}
