import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [KafkaModule, EmailModule],
})
export class AppModule {}
