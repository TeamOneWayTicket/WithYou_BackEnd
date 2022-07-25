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
export class KakaoUser {
  @PrimaryGeneratedColumn()
  @ApiModelProperty({ description: 'id' })
  id: number;

  @Column({ type: 'bigint' })
  @Index()
  @ApiModelProperty({ description: 'kakaoid' })
  kakaoId: string;

  @Column({ nullable: true })
  @ApiModelProperty({ description: 'accessToken' })
  accessToken: string;

  @Column({ nullable: true })
  @ApiModelProperty({ description: 'refreshToken' })
  refreshToken: string;

  @Column({ nullable: true })
  @Index()
  @ApiModelProperty({ description: 'userid' })
  userId: number;

  @OneToOne(() => User, (user) => user.kakaoUser, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
