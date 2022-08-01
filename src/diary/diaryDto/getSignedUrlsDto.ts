import { ApiProperty } from '@nestjs/swagger';

export class GetSignedUrlsDto {
  @ApiProperty({
    description: 'aws에서의 파일명들',
    example:
      '[\n' +
      '        "next-developer-2022-664번.png",\n' +
      '        "7716c397-19bc-4466-a0d3-fbbf004e16e8.png",\n' +
      '        "36db7890-a727-4490-9e85-62e9bbb79fde.png"\n' +
      '    ]',
  })
  fileNamesInS3: string[];
}
