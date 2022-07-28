import { ApiProperty } from '@nestjs/swagger';

export class GetSignedUrlDto {
  @ApiProperty({ description: '기기에서의 파일명', example: 'logo.png' })
  fileName: string;

  @ApiProperty({
    description: 'aws에서의 파일명',
    example: '1/9563e237-b073-49d6-9464-bb3cff6945ab.png',
  })
  fileNameInS3: string;
}
