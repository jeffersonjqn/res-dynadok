import { Customer } from '../entities/customer.entity';
import { BaseRepository } from './base.repository';

// aqui a gente pode colocar metodos especificos pro cliente
// tipo, buscar por email, saca?

export interface CustomerRepository extends BaseRepository<Customer> {
  buscarPorEmail(email: string): Promise<Customer | null>;
}
