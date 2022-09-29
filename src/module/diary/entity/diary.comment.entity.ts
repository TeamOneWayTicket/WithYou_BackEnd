import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Diary } from './diary.entity';
import { LocalDatetimeTransformer } from '../../../transformer/local-datetime.transformer';
import { LocalDateTime } from '@js-joda/core';

@Entity()
@ApiExtraModels()
export class DiaryComment {
  @PrimaryGeneratedColumn()
  @ApiModelProperty({ description: 'id' })
  id: number;

  @Column()
  @Index()
  @ApiModelProperty({ description: '댓글 작성자 id' })
  authorId: number;

  @Column()
  @Index()
  @ApiModelProperty({ description: '일기장 id' })
  diaryId: number;

  @Column({
    default: '',
  })
  @ApiModelProperty({ description: '댓글 내용' })
  content: string;

  @ManyToOne(() => Diary, (diary) => diary.comments, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'diary_id' })
  diary: Diary;

  @ApiModelProperty({ description: '댓글 작성 시점', type: Date })
  @Index()
  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: new LocalDatetimeTransformer(),
  })
  createdAt: LocalDateTime;
}
