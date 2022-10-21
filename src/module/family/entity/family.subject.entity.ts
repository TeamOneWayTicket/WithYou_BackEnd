import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { LocalDateTime } from '@js-joda/core';
import { LocalDatetimeTransformer } from '../../../transformer/local-datetime.transformer';

@Entity()
@ApiExtraModels()
export class FamilySubject {
  @PrimaryGeneratedColumn()
  @ApiModelProperty({ description: 'family id' })
  id: number;

  @Column()
  @ApiModelProperty({ description: 'subject' })
  subject: string;

  @Column()
  @ApiModelProperty({ description: 'subject' })
  familyId: number;

  @ApiModelProperty({ description: 'family 생성 시점', type: Date })
  @Index()
  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: new LocalDatetimeTransformer(),
  })
  createdAt: LocalDateTime;
}
