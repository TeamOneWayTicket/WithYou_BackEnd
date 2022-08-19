import { ApiProperty } from '@nestjs/swagger';

export class CreateFamilyDto {
  @ApiProperty({ description: '가족 이름' })
  familyName: string;
}
