import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

@Entity()
@ApiExtraModels()
export class AppleUser {
  @PrimaryGeneratedColumn()
  @ApiModelProperty({ description: 'id' })
  id: number;

  @Column()
  @Index()
  @ApiModelProperty({ description: 'appleEmail' })
  email: string;

  @Column({ nullable: true })
  @ApiModelProperty({ description: 'accessToken' })
  accessToken: string;

  @Column()
  @Index()
  @ApiModelProperty({ description: 'userId' })
  userId: number;

  @OneToOne(() => User, (user) => user.appleUser, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
