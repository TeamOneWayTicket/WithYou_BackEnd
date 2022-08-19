import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { User } from '../../user/entity/user.entity';

@Entity()
@ApiExtraModels()
export class Family {
  @PrimaryGeneratedColumn()
  @ApiModelProperty({ description: 'family id' })
  id: number;

  @Column()
  @ApiModelProperty({ description: 'family name' })
  familyName: string;

  @OneToMany(() => User, (user) => user.family)
  users: User[];

  @CreateDateColumn()
  @Index()
  @ApiModelProperty({ description: 'family 생성 시점' })
  createdAt: Date;
}
