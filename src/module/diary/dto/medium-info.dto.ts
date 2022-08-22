import { ApiProperty } from '@nestjs/swagger';

export class MediumInfoDto {
  @ApiProperty({ description: 'media type', example: 'image/png' })
  contentType: string;

  @ApiProperty({ description: '갯수', example: 2 })
  quantity: number;
}
