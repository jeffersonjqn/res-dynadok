import { Customer } from '../../domain/entities/customer.entity';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { CacheService } from '../services/cache.service';

// caso de uso pra buscar um cliente por id
// aqui a gente usa o cache pra nao ter que ir no banco toda hora

export class GetCustomerByIdUseCase {
  constructor(
    private customerRepository: CustomerRepository,
    private cacheService: CacheService
  ) {}

  async execute(id: string): Promise<Customer | null> {
    const cacheKey = `customer:${id}`;

    // tenta pegar do cache primeiro
    const cachedCustomer = await this.cacheService.obter<Customer>(cacheKey);
    if (cachedCustomer) {
      console.log('pegou do cache');
      return cachedCustomer;
    }

    // se nao tiver no cache, busca no banco
    const customer = await this.customerRepository.buscarPorId(id);

    // e salva no cache pra proxima vez
    if (customer) {
      await this.cacheService.salvar(cacheKey, customer, 60); // cache de 1 minuto
    }

    return customer;
  }
}
