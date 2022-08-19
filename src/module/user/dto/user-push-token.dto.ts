import { ApiProperty } from '@nestjs/swagger';

export class UserPushTokenDto {
  @ApiProperty()
  token: string;
}
