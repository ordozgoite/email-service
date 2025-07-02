import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);
  const kafkaConfig = configService.get('kafka');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: kafkaConfig.clientId,
        brokers: kafkaConfig.brokersUrl,
      },
      consumer: {
        groupId: 'email-consumer',
        allowAutoTopicCreation: true,
      },
      run: {
        autoCommit: true,
      },
    },
  });

  await app.listen();
  console.log('✅ Email microservice is listening to Kafka');
}
bootstrap();
