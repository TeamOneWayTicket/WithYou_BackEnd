import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserResponseDto {
  @ApiProperty({ description: 'affected row number of delete query' })
  affected: number;
}
