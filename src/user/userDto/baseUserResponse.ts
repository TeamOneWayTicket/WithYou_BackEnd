import { User } from '../user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class BaseUserResponse {
  @ApiProperty({ description: '유저' })
  user: User;
}
