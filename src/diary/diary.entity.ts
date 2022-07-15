import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Diary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  @Index()
  familyId: number;

  @Column()
  authorId: number;

  @Column()
  content: string;

  @Column()
  date: Date;

  @Column()
  created_at: Date;
}
