import { ApiProperty } from '@nestjs/swagger';
import { PutPresignedUrlResponseDto } from './put-presigned-url-response.dto';

export class PutSignedUrlsResponseDto {
  @ApiProperty({
    description: 's3에 저장되는 uuid로 생성된 파일명',
    examples: [
      {
        fileName: 'diary/1/87f8fbb7-ca6a-4950-be3c-14884ec87c9e.png',
        s3Url:
          'https://s3.ap-northeast-2.amazonaws.com/withyou-resource.teamonewayticket/',
      },
      {
        fileName: 'diary/1/dbd3102f-9052-4cd1-9b99-ef6b17a120e4.png',
        s3Url:
          'https://s3.ap-northeast-2.amazonaws.com/withyou-resource.teamonewayticket/',
      },
      {
        fileName: 'diary/1/b01666b0-d3dd-471e-b47b-e8d666f9e157.png',
        s3Url:
          'https://s3.ap-northeast-2.amazonaws.com/withyou-resource.teamonewayticket/',
      },
    ],
  })
  signedUrls: PutPresignedUrlResponseDto[];
}
