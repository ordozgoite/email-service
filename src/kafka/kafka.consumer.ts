import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { EmailService } from '../email/email.service';

@Injectable()
export class KafkaConsumer implements OnModuleInit {
  constructor(private readonly emailService: EmailService) { }

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'email',
      brokers: ['kafka:29092'],
    });

    const consumer = kafka.consumer({ groupId: 'email-consumer' });

    await consumer.connect();
    await consumer.subscribe({ topic: 'task_events', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const key = message.key?.toString();
        const value = message.value?.toString();

        if (!key || !value) return;

        const task = JSON.parse(value);

        switch (key) {
          case 'task_created':
            await this.emailService.sendEmail(
              'Nova tarefa criada!',
              `Título: ${task.title}\nDescrição: ${task.description}`
            );
            break;

          case 'task_updated':
            await this.emailService.sendEmail(
              `Terefa marcada como ${task.status}!`,
              `Título: ${task.title}\nDescrição: ${task.description}`
            )
            break;

          case 'task_deleted':
            await this.emailService.sendEmail(
              'Tarefa deletada!',
              `Você acabou de deletar a tarefa "${task.title}".`
            );
            break;

          default:
            console.log(`🔔 Evento desconhecido: ${key}`);
        }
      },
    });
  }
}
