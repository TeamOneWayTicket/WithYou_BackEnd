import { ApiProperty } from '@nestjs/swagger';

export class GetSignedUrlDto {
  @ApiProperty({
    description: 'aws에서의 파일명',
    example: 'next-developer-2022-664번.png',
  })
  fileNameInS3: string;
}
