import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Object
@Entity()
export class KakaoUser {
  @PrimaryGeneratedColumn() // 이 Annotation을 통해 기본키로 사용함을 명시함
  kakaoUserid: number;

  @Column({ nullable: false })
  kakaoIdx: number;

  @Column({ nullable: true })
  accessToken: string;

  @Column({ nullable: true })
  refreshToken: string;
}
