import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseCloudMessageService } from './firebase-cloud-message.service';

describe('FirebaseCloudMessageService', () => {
  let service: FirebaseCloudMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseCloudMessageService],
    }).compile();

    service = module.get<FirebaseCloudMessageService>(
      FirebaseCloudMessageService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
