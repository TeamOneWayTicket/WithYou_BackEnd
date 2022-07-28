import { ApiProperty } from '@nestjs/swagger';

export class GetSignedUrlDto {
  @ApiProperty({ description: '기기에서의 파일명' })
  fileName: string;

  @ApiProperty({ description: 'aws에서의 파일명' })
  fileNameInS3: string;
}
