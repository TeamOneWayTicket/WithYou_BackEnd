import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'withyou Server homepages';
  }
  getTest(): string {
    return 'withyou Server testpages testing';
  }
}
