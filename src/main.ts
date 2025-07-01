import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'email-service',
        brokers: ['kafka:29092'],
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
