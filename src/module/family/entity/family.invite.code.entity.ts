import { Entity, Column, Index, PrimaryColumn } from 'typeorm';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { LocalDateTime } from '@js-joda/core';
import { LocalDatetimeTransformer } from '../../../transformer/local-datetime.transformer';

@Entity()
@ApiExtraModels()
export class FamilyInviteCode {
  @PrimaryColumn()
  @Index()
  @ApiModelProperty({ description: 'code id' })
  inviteCode: string;

  @Column()
  @Index()
  @ApiModelProperty({ description: 'family id' })
  familyId: number;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: new LocalDatetimeTransformer(),
  })
  @ApiModelProperty({ description: 'code 생성 시점' })
  createdAt: LocalDateTime;
}
