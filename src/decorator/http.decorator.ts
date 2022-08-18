import { Role } from '../common/enum/role.enum';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { RolesGuard } from '../guard/roles.guard';
import JwtAuthGuard from '../guard/jwt.auth.guard';

export function Auth(...roles: Role[]) {
  return applyDecorators(Roles(roles), UseGuards(JwtAuthGuard, RolesGuard));
}
