import { UpdateCustomerUseCase } from './update-customer.use-case';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { CacheService } from '../services/cache.service';
import { Customer } from '../../domain/entities/customer.entity';

const makeCustomer = (): Customer => ({
  id: 'abc',
  nome: 'fulano',
  email: 'fulano@email.com',
  telefone: '11999999999'
});

describe('UpdateCustomerUseCase', () => {
  const repositoryMock = (): jest.Mocked<CustomerRepository> => ({
    criar: jest.fn(),
    atualizar: jest.fn(),
    remover: jest.fn(),
    buscarPorId: jest.fn(),
    buscarTodos: jest.fn(),
    buscarPorEmail: jest.fn()
  });

  const cacheMock = (): jest.Mocked<CacheService> => ({
    obter: jest.fn(),
    salvar: jest.fn(),
    remover: jest.fn()
  });

  it('deve atualizar o cliente e limpar o cache', async () => {
    const repo = repositoryMock();
    const cache = cacheMock();
    const updatedCustomer = makeCustomer();

    repo.atualizar.mockResolvedValue(updatedCustomer);

    const useCase = new UpdateCustomerUseCase(repo, cache);

    const result = await useCase.execute('abc', { telefone: '11888888888' });

    expect(repo.atualizar).toHaveBeenCalledWith('abc', { telefone: '11888888888' });
    expect(cache.remover).toHaveBeenCalledWith('customer:abc');
    expect(result).toEqual(updatedCustomer);
  });

  it('nao deve limpar cache quando cliente nao existe', async () => {
    const repo = repositoryMock();
    const cache = cacheMock();

    repo.atualizar.mockResolvedValue(null);

    const useCase = new UpdateCustomerUseCase(repo, cache);

    const result = await useCase.execute('abc', { telefone: '11888888888' });

    expect(result).toBeNull();
    expect(cache.remover).not.toHaveBeenCalled();
  });
});
