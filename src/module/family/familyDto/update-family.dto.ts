import { ApiProperty } from '@nestjs/swagger';

export class UpdateFamilyDto {
  @ApiProperty({ description: '가족 이름' })
  familyName: string;
}
