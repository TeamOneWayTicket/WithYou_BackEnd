import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Object
@Entity()
export class KakaoUser {
  @PrimaryGeneratedColumn() // 이 Annotation을 통해 기본키로 사용함을 명시함
  kakao_userid: number;

  @Column({ nullable: false })
  kakao_idx: number;

  @Column({ nullable: true })
  access_token: string;

  @Column({ nullable: true })
  refresh_token: string;
}
