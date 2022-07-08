import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm';

@Object
@Entity()
export class User {
  @PrimaryGeneratedColumn() // 이 Annotation을 통해 기본키로 사용함을 명시함
  id: number;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  userName: string;

  @Column({ nullable: false })
  userEmail: string;

  @Column({ nullable: false })
  userPassword: string;
}
