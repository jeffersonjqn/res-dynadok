import { Customer } from '../../domain/entities/customer.entity';
import { CustomerRepository } from '../../domain/repositories/customer.repository';

// caso de uso pra listar todos os clientes

export class ListCustomersUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }
}
