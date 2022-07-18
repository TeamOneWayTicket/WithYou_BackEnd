import { Column, Entity, Index } from 'typeorm';

@Entity()
export class UpdateUserDto {
  @Column({
    nullable: true,
  })
  @Index()
  familyId: number;

  @Column({
    nullable: true,
  })
  nickname: string;

  @Column({
    nullable: true,
  })
  gender: string;
}
