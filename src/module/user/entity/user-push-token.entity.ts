import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { LocalDateTime } from '@js-joda/core';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { LocalDatetimeTransformer } from '../../../transformer/local-datetime.transformer';

@Entity()
export class UserPushToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  userId: number;

  @Column()
  firebaseToken: string;

  @ApiModelProperty({ type: Date })
  @Column('timestamp', {
    onUpdate: 'CURRENT_TIMESTAMP',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: new LocalDatetimeTransformer(),
  })
  updatedAt: LocalDateTime;
}
