import { GetCustomerByIdUseCase } from './get-customer-by-id.use-case';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { CacheService } from '../services/cache.service';
import { Customer } from '../../domain/entities/customer.entity';

const makeCustomer = (): Customer => ({
  id: 'abc',
  nome: 'fulano',
  email: 'fulano@email.com',
  telefone: '11999999999'
});

describe('GetCustomerByIdUseCase', () => {
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

  it('deve retornar cliente do cache quando existir', async () => {
    const repo = repositoryMock();
    const cache = cacheMock();
    const cachedCustomer = makeCustomer();

    cache.obter.mockResolvedValue(cachedCustomer);

    const useCase = new GetCustomerByIdUseCase(repo, cache);

    const result = await useCase.execute('abc');

    expect(result).toEqual(cachedCustomer);
    expect(repo.buscarPorId).not.toHaveBeenCalled();
  });

  it('deve buscar no repositorio e salvar no cache quando nao existir no cache', async () => {
    const repo = repositoryMock();
    const cache = cacheMock();
    const customer = makeCustomer();

    cache.obter.mockResolvedValue(null);
    repo.buscarPorId.mockResolvedValue(customer);

    const useCase = new GetCustomerByIdUseCase(repo, cache);

    const result = await useCase.execute('abc');

    expect(repo.buscarPorId).toHaveBeenCalledWith('abc');
    expect(cache.salvar).toHaveBeenCalledWith('customer:abc', customer, 60);
    expect(result).toEqual(customer);
  });

  it('deve retornar null quando nao encontrar no repositorio', async () => {
    const repo = repositoryMock();
    const cache = cacheMock();

    cache.obter.mockResolvedValue(null);
    repo.buscarPorId.mockResolvedValue(null);

    const useCase = new GetCustomerByIdUseCase(repo, cache);

    const result = await useCase.execute('abc');

    expect(result).toBeNull();
    expect(cache.salvar).not.toHaveBeenCalled();
  });
});
