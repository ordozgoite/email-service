import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { EmailModule } from './email/email.module';
import config from './config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [config],
  }),
  KafkaModule, EmailModule],
})
export class AppModule {}
