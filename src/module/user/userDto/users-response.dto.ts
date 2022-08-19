import { User } from '../user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UsersResponseDto {
  @ApiProperty({ description: '유저', type: [User] })
  users: User[];
}
