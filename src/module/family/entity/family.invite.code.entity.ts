import {
  Entity,
  Column,
  CreateDateColumn,
  Index,
  PrimaryColumn,
} from 'typeorm';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

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

  @CreateDateColumn()
  @ApiModelProperty({ description: 'code 생성 시점' })
  createdAt: Date;
}
