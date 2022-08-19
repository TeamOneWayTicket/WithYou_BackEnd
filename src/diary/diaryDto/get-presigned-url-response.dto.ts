import { ApiProperty } from '@nestjs/swagger';

export class GetPresignedUrlResponseDto {
  @ApiProperty({
    description: 'presigned url',
    example:
      'https://s3.ap-northeast-2.amazonaws.com/withyou-resource.teamonewayticket/~~~',
  })
  s3Url: string;
}
