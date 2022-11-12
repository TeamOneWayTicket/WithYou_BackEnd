import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DiaryService } from '../module/diary/service/diary.service';
import { SCOPES_KEY } from '../decorator/scopes.decorator';
import { Scope } from '../common/enum/scope.enum';

@Injectable()
export class ScopeGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly diaryService: DiaryService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params } = context.switchToHttp().getRequest();

    const requiredScopes = this.reflector.getAllAndOverride<Scope[]>(
      SCOPES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredScopes.includes(Scope.Anonymous)) {
      return true;
    }
    const diary = await this.diaryService.findDiaryWithUrls(params.diaryId);
    if (requiredScopes.includes(Scope.Family)) {
      return diary.author.familyId == user.familyId;
    }
    if (requiredScopes.includes(Scope.User)) {
      return diary.author.id == user.id;
    }
  }
}
