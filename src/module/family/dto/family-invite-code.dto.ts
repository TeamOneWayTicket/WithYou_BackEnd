import { ApiProperty } from '@nestjs/swagger';

export class FamilyInviteCodeDto {
  @ApiProperty({ description: 'family invite code' })
  inviteCode: string;
}
