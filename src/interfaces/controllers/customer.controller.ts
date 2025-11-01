import { Request, Response } from 'express';
import { CreateCustomerUseCase } from '../../application/use-cases/create-customer.use-case';
import { GetCustomerByIdUseCase } from '../../application/use-cases/get-customer-by-id.use-case';
import { ListCustomersUseCase } from '../../application/use-cases/list-customers.use-case';
import { UpdateCustomerUseCase } from '../../application/use-cases/update-customer.use-case';

export class CustomerController {

  constructor(
    private createCustomerUseCase: CreateCustomerUseCase,
    private getCustomerByIdUseCase: GetCustomerByIdUseCase,
    private listCustomersUseCase: ListCustomersUseCase,
    private updateCustomerUseCase: UpdateCustomerUseCase
  ) {}

  async criar(req: Request, res: Response): Promise < Response> {
    try {
      const { nome, email, telefone } = req.body;
      const customer = await this.createCustomerUseCase.execute(nome, email, telefone);
      return res.status(201).json(customer);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const customer = await this.getCustomerByIdUseCase.execute(id);

      if (!customer) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }

      return res.json(customer);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async listar(req: Request, res: Response): Promise<Response> {
    try {
      const customers = await this.listCustomersUseCase.execute();
      return res.json(customers);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async atualizar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const customer = await this.updateCustomerUseCase.execute(id, req.body);

      if (!customer) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }

      return res.json(customer);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
