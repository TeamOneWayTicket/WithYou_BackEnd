import { ApiProperty } from '@nestjs/swagger';
import { PutSignedUrlResponse } from './putSignedUrlResponse';

export class PutSignedUrlsResponse {
  @ApiProperty({
    description: 's3에 저장되는 uuid로 생성된 파일명',
    example:
      '[\n' +
      '        {\n' +
      '            "fileName": "diary/1/87f8fbb7-ca6a-4950-be3c-14884ec87c9e.png",\n' +
      '            "s3Url": "https://s3.ap-northeast-2.amazonaws.com/withyou-resource.teamonewayticket/diary/1/87f8fbb7-ca6a-4950-be3c-14884ec87c9e.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAX5JXGVYZLU6N7EEM%2F20220729%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20220729T054748Z&X-Amz-Expires=3600&X-Amz-Signature=40ac22739789b4a2cac4cf4262f9436dec67de59ef698bc95b02018ef066cae9&X-Amz-SignedHeaders=host"\n' +
      '        },\n' +
      '        {\n' +
      '            "fileName": "diary/1/dbd3102f-9052-4cd1-9b99-ef6b17a120e4.png",\n' +
      '            "s3Url": "https://s3.ap-northeast-2.amazonaws.com/withyou-resource.teamonewayticket/diary/1/dbd3102f-9052-4cd1-9b99-ef6b17a120e4.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAX5JXGVYZLU6N7EEM%2F20220729%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20220729T054748Z&X-Amz-Expires=3600&X-Amz-Signature=e05ef4d1f0afc827a6e9c0dcc00ee5af04f481e0e7edc790bc5905335ec25d7f&X-Amz-SignedHeaders=host"\n' +
      '        },\n' +
      '        {\n' +
      '            "fileName": "diary/1/b01666b0-d3dd-471e-b47b-e8d666f9e157.png",\n' +
      '            "s3Url": "https://s3.ap-northeast-2.amazonaws.com/withyou-resource.teamonewayticket/diary/1/b01666b0-d3dd-471e-b47b-e8d666f9e157.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAX5JXGVYZLU6N7EEM%2F20220729%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20220729T054748Z&X-Amz-Expires=3600&X-Amz-Signature=59ac79195fb94ab9542a6d9becb73d2ef659710de4122ece2c3f7d9718b7c5e8&X-Amz-SignedHeaders=host"\n' +
      '        }\n' +
      '    ]',
  })
  signedUrls: PutSignedUrlResponse[];
}
