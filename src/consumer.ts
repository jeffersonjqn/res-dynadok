import * as amqp from 'amqplib';

const main = async () => {
  try {
    const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
    const connection = await amqp.connect(rabbitUrl);
    const channel = await connection.createChannel();

    const queue = 'customer_created';
    await channel.assertQueue(queue, { durable: true });

    console.log(`[*] Aguardando mensagens na fila ${queue}. Para sair, pressione CTRL+C`);

    channel.consume(queue, (msg) => {
      if (msg) {
        console.log(`[x] Recebida: ${msg.content.toString()}`);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Erro ao iniciar o consumidor:', error);
  }
};

main();
