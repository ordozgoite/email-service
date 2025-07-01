// src/kafka/kafka.consumer.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailService } from '../email/email.service';

@Controller()
export class KafkaConsumer {
  constructor(private readonly emailService: EmailService) {}

  @MessagePattern('task_events')
  async handleTaskEvents(@Payload() message: any) {
    console.log("🔔 handleTaskEvents recebido:", message);
    
    const eventType = message.eventType;
    const task = message.data;

    console.log("🔍 EventType:", eventType, "Task:", task);

    if (!eventType || !task) {
      console.log("❌ EventType ou data vazios, ignorando mensagem");
      return;
    }

    switch (eventType) {
      case 'task_created':
        console.log("Recebi a mensagem no kafka consumer!");
        
        await this.emailService.sendEmail(
          'Nova tarefa criada!',
          `Título: ${task.title}\nDescrição: ${task.description}`,
        );
        break;

      case 'task_updated':
        await this.emailService.sendEmail(
          `Tarefa marcada como ${task.status}!`,
          `Título: ${task.title}\nDescrição: ${task.description}`,
        );
        break;

      case 'task_deleted':
        await this.emailService.sendEmail(
          'Tarefa deletada!',
          `Você acabou de deletar a tarefa "${task.title}".`,
        );
        break;

      default:
        console.log(`🔔 Evento desconhecido: ${eventType}`);
    }
  }
}