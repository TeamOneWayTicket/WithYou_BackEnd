import { ApiProperty } from '@nestjs/swagger';

export class DeleteFamilyResponseDto {
  @ApiProperty({ description: 'code' })
  statusCode: number;

  @ApiProperty({ description: 'msg' })
  statusMsg: string;

  @ApiProperty({ description: '삭제 가족 id' })
  familyId: number;
}
