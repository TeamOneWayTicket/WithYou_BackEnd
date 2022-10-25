import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { User } from './user.entity';

@Entity()
@ApiExtraModels()
export class LocalUser {
  @PrimaryGeneratedColumn()
  @ApiModelProperty({ description: 'id' })
  id: number;

  @Column()
  @Index()
  @ApiModelProperty({ description: 'email' })
  email: string;

  @Column()
  @Index()
  @ApiModelProperty({ description: 'password' })
  password: string;

  @Column()
  @Index()
  @ApiModelProperty({ description: '연결된 유저 id' })
  userId: number;

  @OneToOne(() => User, (user) => user.localUser, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
