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

@Entity()
@ApiExtraModels()
export class DiaryMedium {
  @PrimaryGeneratedColumn()
  @ApiModelProperty({ description: 'id' })
  id: number;

  @Column({
    nullable: true,
  })
  @Index()
  @ApiModelProperty({ description: '일기장 id' })
  diaryId: number;

  @Column({
    nullable: true,
  })
  @Index()
  @ApiModelProperty({ description: '순서 번호' })
  order: number;

  @ManyToOne(() => Diary, (diary) => diary.mediums, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'diary_id' })
  diary: Diary;
}
