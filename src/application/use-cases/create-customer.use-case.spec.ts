import { CreateCustomerUseCase } from './create-customer.use-case';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { MessagingService } from '../services/messaging.service';
import { Customer } from '../../domain/entities/customer.entity';

const makeCustomer = (): Customer => ({
  id: 'any-id',
  nome: 'any name',
  email: 'any@email.com',
  telefone: '11999999999',
});

describe('CreateCustomerUseCase', () => {
  const repositoryMock = (): jest.Mocked<CustomerRepository> => ({
    criar: jest.fn(),
    atualizar: jest.fn(),
    remover: jest.fn(),
    buscarPorId: jest.fn(),
    buscarTodos: jest.fn(),
    buscarPorEmail: jest.fn(),
  });

  const messagingMock = (): jest.Mocked<MessagingService> => ({
    enviarMensagem: jest.fn(),
  });

  it('deve criar o cliente e enviar mensagem para fila', async () => {
    const customerRepo = repositoryMock();
    const messagingService = messagingMock();

    customerRepo.criar.mockResolvedValue(makeCustomer());

    const useCase = new CreateCustomerUseCase(customerRepo, messagingService);

    const result = await useCase.execute('any name', 'any@email.com', '11999999999');

    expect(customerRepo.criar).toHaveBeenCalledWith(expect.objectContaining({
      nome: 'any name',
      email: 'any@email.com',
      telefone: '11999999999',
    }));
    expect(messagingService.enviarMensagem).toHaveBeenCalledWith(
      'customer_created',
      expect.any(String)
    );
    expect(result).toEqual(makeCustomer());
  });

  it('deve propagar erro do repositorio', async () => {
    const customerRepo = repositoryMock();
    const messagingService = messagingMock();
    const expectedError = new Error('falha');

    customerRepo.criar.mockRejectedValue(expectedError);

    const useCase = new CreateCustomerUseCase(customerRepo, messagingService);

    await expect(
      useCase.execute('any name', 'any@email.com', '11999999999')
    ).rejects.toThrow(expectedError);

    expect(messagingService.enviarMensagem).not.toHaveBeenCalled();
  });
});
