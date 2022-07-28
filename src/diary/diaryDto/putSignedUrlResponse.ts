import { ApiProperty } from '@nestjs/swagger';

export class PutSignedUrlResponse {
  @ApiProperty({
    description: 's3에 저장되는 uuid로 생성된 파일명',
    example: '1/9563e237-b073-49d6-9464-bb3cff6945ab.png',
  })
  fileName: string;

  @ApiProperty({
    description: 'presigned url',
    example:
      'https://s3.ap-northeast-2.amazonaws.com/withyou-resource.teamonewayticket/~~~',
  })
  s3Url: string;
}
