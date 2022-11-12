import { Role } from '../common/enum/role.enum';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { RolesGuard } from '../guard/roles.guard';
import JwtAuthGuard from '../guard/jwt.auth.guard';
import { ScopeGuard } from '../guard/scope.guard';
import { Scope } from '../common/enum/scope.enum';
import { Scopes } from './scopes.decorator';

export function Auth(...roles: Role[]) {
  return applyDecorators(Roles(roles), UseGuards(JwtAuthGuard, RolesGuard));
}

export function Privacy(...scopes: Scope[]) {
  return applyDecorators(Scopes(scopes), UseGuards(JwtAuthGuard, ScopeGuard));
}
