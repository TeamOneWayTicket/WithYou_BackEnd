import { Test, TestingModule } from '@nestjs/testing';
import { User.KakaoController } from './user.kakao.controller';

describe('User.KakaoController', () => {
  let controller: User.KakaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [User.KakaoController],
    }).compile();

    controller = module.get<User.KakaoController>(User.KakaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
