import { Module } from '@nestjs/common';
import { KafkaConsumer } from './kafka.consumer';
import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [KafkaConsumer],
  imports: [EmailModule]
})
export class KafkaModule {}
