import { ApiProperty } from '@nestjs/swagger';

export class FamilyResponseDto {
  @ApiProperty({ description: 'family id' })
  id: number;

  @ApiProperty({ description: 'family name' })
  familyName: string;

  @ApiProperty({ description: 'family 생성 시점' })
  createdAt: Date;
}
