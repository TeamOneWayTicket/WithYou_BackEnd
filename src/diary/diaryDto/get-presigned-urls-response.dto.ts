import { ApiProperty } from '@nestjs/swagger';

export class GetPresignedUrlsResponseDto {
  @ApiProperty({
    description: 'presigned url',
    example:
      '[\n' +
      '        "https://s3.ap-northeast-2.amazonaws.com/withyou-resource.teamonewayticket/next-developer-2022-664%EB%B2%88.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAX5JXGVYZLU6N7EEM%2F20220729%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20220729T060142Z&X-Amz-Expires=3600&X-Amz-Signature=4ac5b1297e32d8285ea746d575d957baba86ac67029aae15d315dd774f2509ee&X-Amz-SignedHeaders=host",\n' +
      '        "https://s3.ap-northeast-2.amazonaws.com/withyou-resource.teamonewayticket/e99933a3-32d1-40d2-af15-3368431b0130.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAX5JXGVYZLU6N7EEM%2F20220729%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20220729T060142Z&X-Amz-Expires=3600&X-Amz-Signature=7aa39e2ff271f01babea50fabae8e7e3bd77dea661d30881e109670cdb3a0924&X-Amz-SignedHeaders=host",\n' +
      '        "https://s3.ap-northeast-2.amazonaws.com/withyou-resource.teamonewayticket/36db7890-a727-4490-9e85-62e9bbb79fde.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAX5JXGVYZLU6N7EEM%2F20220729%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20220729T060142Z&X-Amz-Expires=3600&X-Amz-Signature=bc346177ee2c77e80471bb466b370284416accc88a4c5ff9b53715d03a735b13&X-Amz-SignedHeaders=host"\n' +
      '    ]',
  })
  s3Urls: string[];
}
