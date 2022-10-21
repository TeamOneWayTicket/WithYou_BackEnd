import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { User } from '../../user/entity/user.entity';
import { FamilyService } from '../family.service';
import { Auth } from '../../../decorator/http.decorator';
import { Role } from '../../../common/enum/role.enum';
import { UserParam } from '../../../decorator/user.decorator';
import { FamilySubjectResponseDto } from '../dto/family-subject-response.dto';

@Controller('family/subject')
export class FamilySubjectController {
  constructor(private readonly familyService: FamilyService) {}

  @Get()
  @Auth(Role.User)
  @ApiOkResponse({ description: '성공', type: FamilySubjectResponseDto })
  @ApiOperation({
    summary: 'getFamily today subject',
  })
  async getFamilyTodaySubject(
    @UserParam() user: User,
  ): Promise<FamilySubjectResponseDto> {
    return await this.familyService.getFamilyTodaySubject(user.familyId);
  }
}
