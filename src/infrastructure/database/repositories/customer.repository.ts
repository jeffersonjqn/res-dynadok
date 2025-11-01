import { Customer } from '../../../domain/entities/customer.entity';
import { CustomerRepository } from '../../../domain/repositories/customer.repository';
import { CustomerModel } from '../schemas/customer.schema';

export class MongoCustomerRepository implements CustomerRepository {
  async criar(customer: Customer): Promise<Customer> {
    const newCustomer = new CustomerModel(customer);
    const savedCustomer = await newCustomer.save();
    return savedCustomer.toObject() as Customer;
  }

  async atualizar(id: string, customer: Partial<Customer>) : Promise<Customer | null> {
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(id, customer, { new: true });
    return updatedCustomer ? updatedCustomer.toObject() as Customer : null;
  }

  async remover(id: string): Promise<boolean> {
    const result = await CustomerModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async buscarPorId(id: string): Promise<Customer | null> {
    const customer = await CustomerModel.findById(id);
    return customer ? customer.toObject() as Customer : null;
  }

  async buscarTodos(): Promise<Customer[]> {
    const customers = await CustomerModel.find();
    return customers.map((c: any) => c.toObject() as Customer);
  }

  async buscarPorEmail(email: string): Promise<Customer | null> {
    const customer = await CustomerModel.findOne({ email });
    return customer ? customer.toObject() as Customer : null;
  }
}
