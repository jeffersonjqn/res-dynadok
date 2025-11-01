import { Customer } from '../../domain/entities/customer.entity';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { CacheService } from '../services/cache.service';

// atualizar cliente

export class UpdateCustomerUseCase {
  constructor(
    private customerRepository: CustomerRepository,
    private cacheService: CacheService
  ) {}

  async execute(id: string, data: Partial<Customer>): Promise<Customer | null> {
    const updatedCustomer = await this.customerRepository.atualizar(id, data);

    if (updatedCustomer) {
      const cacheKey = `customer:${id}`;
      await this.cacheService.remover(cacheKey);
    }

    return updatedCustomer;
  }
}
