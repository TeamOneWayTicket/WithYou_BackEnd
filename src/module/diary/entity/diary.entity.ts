import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { DiaryMedium } from './diary.medium.entity';
import { LocalDateTime } from '@js-joda/core';
import { LocalDatetimeTransformer } from '../../../transformer/local-datetime.transformer';
import { DiaryComment } from './diary.comment.entity';

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
    type: 'text',
    nullable: true,
  })
  @ApiModelProperty({ description: '일기장 내용' })
  content: string;

  @ApiModelProperty({ description: '일기장 작성 시점', type: Date })
  @Index()
  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: new LocalDatetimeTransformer(),
  })
  createdAt: LocalDateTime;

  @ManyToOne(() => User, (user) => user.diaries, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany(() => DiaryMedium, (diaryMedium) => diaryMedium.diary)
  media: DiaryMedium[];

  @OneToMany(() => DiaryComment, (diaryComment) => diaryComment.diary)
  comments: DiaryComment[];
}
