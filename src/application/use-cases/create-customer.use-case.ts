import { Customer } from '../../domain/entities/customer.entity';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { MessagingService } from '../services/messaging.service';

export class CreateCustomerUseCase {
  constructor(
    private customerRepository: CustomerRepository,
    private messagingService: MessagingService
  ) {}

  async execute(nome: string, email: string, telefone: string): Promise<Customer> {
    const customer = new Customer(nome, email, telefone);
    const newCustomer = await this.customerRepository.criar(customer);

    // Envia uma mensagem para a fila avisando que um novo cliente foi criado
    await this.messagingService.enviarMensagem('customer_created', JSON.stringify(newCustomer));

    return newCustomer;
  }
}
