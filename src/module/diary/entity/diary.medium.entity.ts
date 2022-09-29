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
export class DiaryMedium {
  @PrimaryGeneratedColumn()
  @ApiModelProperty({ description: 'id' })
  id: number;

  @Column()
  @Index()
  @ApiModelProperty({ description: '일기장 id' })
  diaryId: number;

  @Column({
    nullable: true,
  })
  @ApiModelProperty({ description: '순서 번호' })
  order: number;

  @Column()
  @ApiModelProperty({ description: 's3에 저장된 파일명' })
  fileNameInS3: string;

  @ManyToOne(() => Diary, (diary) => diary.media, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'diary_id' })
  diary: Diary;

  @ApiModelProperty({ description: 'medium 작성 시점', type: Date })
  @Index()
  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: new LocalDatetimeTransformer(),
  })
  createdAt: LocalDateTime;
}
