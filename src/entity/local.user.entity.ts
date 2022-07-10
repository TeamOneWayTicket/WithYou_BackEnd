import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Object
@Entity()
export class LocalUser {
  @PrimaryGeneratedColumn() // 이 Annotation을 통해 기본키로 사용함을 명시함
  user_id: number;

  @Column({ nullable: false })
  user_email: string;

  @Column({ nullable: false })
  user_password: string;

  // @OneToOne()
  // localUser: LocalUser;
}
