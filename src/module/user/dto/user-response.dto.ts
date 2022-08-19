import { User } from '../entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: '유저' })
  user: User;
}
