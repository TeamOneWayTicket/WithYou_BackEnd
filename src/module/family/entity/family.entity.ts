import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { User } from '../../user/entity/user.entity';
import { LocalDateTime } from '@js-joda/core';
import { LocalDatetimeTransformer } from '../../../transformer/local-datetime.transformer';

@Entity()
@ApiExtraModels()
export class Family {
  @PrimaryGeneratedColumn()
  @ApiModelProperty({ description: 'family id' })
  id: number;

  @Column()
  @ApiModelProperty({ description: 'family name' })
  name: string;

  @OneToMany(() => User, (user) => user.family)
  users: User[];

  @ApiModelProperty({ description: 'family 생성 시점', type: Date })
  @Index()
  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: new LocalDatetimeTransformer(),
  })
  createdAt: LocalDateTime;
}
