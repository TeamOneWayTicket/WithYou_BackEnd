import { ApiProperty } from '@nestjs/swagger';

export class FamilySubjectResponseDto {
  @ApiProperty({ description: 'subject' })
  subject: string;
}
