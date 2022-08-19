import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserResponseDto {
  @ApiProperty({ description: 'code' })
  statusCode: number;

  @ApiProperty({ description: 'msg' })
  statusMsg: string;

  @ApiProperty({ description: '삭제유저 id' })
  id: number;
}
