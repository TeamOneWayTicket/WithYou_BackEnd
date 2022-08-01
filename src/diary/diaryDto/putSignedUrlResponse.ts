import { ApiProperty } from '@nestjs/swagger';

export class PutSignedUrlResponse {
  @ApiProperty({
    description: 's3에 저장되는 uuid로 생성된 파일명',
    example: 'diary/1/87f8fbb7-ca6a-4950-be3c-14884ec87c9e.png',
  })
  fileName: string;

  @ApiProperty({
    description: 'presigned url',
    example:
      'https://s3.ap-northeast-2.amazonaws.com/withyou-resource.teamonewayticket/diary/1/87f8fbb7-ca6a-4950-be3c-14884ec87c9e.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAX5JXGVYZLU6N7EEM%2F20220729%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20220729T054748Z&X-Amz-Expires=3600&X-Amz-Signature=40ac22739789b4a2cac4cf4262f9436dec67de59ef698bc95b02018ef066cae9&X-Amz-SignedHeaders=host',
  })
  s3Url: string;
}
