import { Column, Entity } from 'typeorm';

@Entity()
export class UpdateDiaryDto {
  @Column({
    nullable: true,
  })
  content: string;
}
