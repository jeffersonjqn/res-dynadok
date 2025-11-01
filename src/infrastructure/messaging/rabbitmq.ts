import * as amqp from 'amqplib';
import { MessagingService } from '../../application/services/messaging.service';

export class RabbitMQService implements MessagingService {
  private channel: amqp.Channel | null = null;

  constructor() {
    this.connect().catch(err => console.error('Falha na conexão com RabbitMQ', err));
  }

  private async connect() {
    try {
      const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
      const connection = await amqp.connect(rabbitUrl);
      this.channel = await connection.createChannel();
      console.log('RabbitMQ conectado com sucesso.');
    } catch (error) {
      console.error('Erro ao conectar no RabbitMQ:', error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  async enviarMensagem(queue: string, message: string): Promise<void> {
    if (!this.channel) {
      console.error('RabbitMQ não esta disponivel, mensagem não enviada.');
      return;
    }

    try {
      await this.channel.assertQueue(queue, { durable: true });
      this.channel.sendToQueue(queue, Buffer.from(message));
    } catch (error) {
        console.error('Erro ao enviar mensagem para o RabbitMQ:', error)
    }
  }
}
