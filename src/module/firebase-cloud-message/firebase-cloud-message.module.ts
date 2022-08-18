import { Module } from '@nestjs/common';
import { FirebaseCloudMessageService } from './firebase-cloud-message.service';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [UserModule],
  providers: [FirebaseCloudMessageService],
})
export class FirebaseCloudMessageModule {}
