import { Entity, Column, CreateDateColumn, Index } from 'typeorm';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

@Entity()
@ApiExtraModels()
export class Family {
  @Column()
  @Index()
  @ApiModelProperty({ description: 'code id' })
  code: string;

  @Column()
  @Index()
  @ApiModelProperty({ description: 'family id' })
  familyId: number;

  @CreateDateColumn()
  @ApiModelProperty({ description: 'code 생성 시점' })
  createdAt: Date;

  @CreateDateColumn()
  @ApiModelProperty({ description: 'code 만료 시점' })
  expiredAt: Date;
}
