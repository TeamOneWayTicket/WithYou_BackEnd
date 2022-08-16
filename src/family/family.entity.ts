import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiExtraModels } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { User } from '../user/user.entity';

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
}
