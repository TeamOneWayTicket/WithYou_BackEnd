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
export class GoogleUser {
  @PrimaryGeneratedColumn()
  @ApiModelProperty({ description: 'id' })
  id: number;

  @Column({ type: 'bigint' })
  @Index()
  @ApiModelProperty({ description: 'google id' })
  googleId: string;

  @Column({ nullable: true })
  @ApiModelProperty({ description: 'google email' })
  email: string;

  @Column({ nullable: true })
  @ApiModelProperty({ description: 'google name' })
  name: string;

  @Column({ nullable: true })
  @Index()
  @ApiModelProperty({ description: '연결된 유저 id' })
  userId: number;

  @OneToOne(() => User, (user) => user.googleUser, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
