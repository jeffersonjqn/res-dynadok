// a doc do amqplib mostra o padrao de criar canais e filas mas recomenda encapsular conexao
// então deixei apenas enviarMensagem aqui

export interface MessagingService {
  enviarMensagem(queue: string, message: string): Promise<void>;
}
