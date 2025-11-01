import express from 'express';
import { connectDB } from './infrastructure/database/mongo';
import { MongoCustomerRepository } from './infrastructure/database/repositories/customer.repository';
import { RedisCacheService } from './infrastructure/cache/redis';
import { RabbitMQService } from './infrastructure/messaging/rabbitmq';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case';
import { GetCustomerByIdUseCase } from './application/use-cases/get-customer-by-id.use-case';
import { ListCustomersUseCase } from './application/use-cases/list-customers.use-case';
import { UpdateCustomerUseCase } from './application/use-cases/update-customer.use-case';
import { CustomerController } from './interfaces/controllers/customer.controller';
import { createCustomerRouter } from './interfaces/routes/customer.routes';

// o server.ts é o ponto de entrada da aplicacao
// aqui a gente junta todas as pecas do quebra-cabeca

const main = async () => {
  await connectDB();

  const app = express();
  app.use(express.json());

  // dependencias
  const customerRepository = new MongoCustomerRepository();
  const cacheService = new RedisCacheService();
  const messagingService = new RabbitMQService();

  // casos de uso
  const createCustomerUseCase = new CreateCustomerUseCase(customerRepository, messagingService);
  const getCustomerByIdUseCase = new GetCustomerByIdUseCase(customerRepository, cacheService);
  const listCustomersUseCase = new ListCustomersUseCase(customerRepository);
  const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository, cacheService);

  // controller
  const customerController = new CustomerController(
    createCustomerUseCase,
    getCustomerByIdUseCase,
    listCustomersUseCase,
    updateCustomerUseCase
  );

  // rotas
  const customerRouter = createCustomerRouter(customerController);
  app.use('/api', customerRouter);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
};

main().catch(error => {
  console.error('Erro ao iniciar o servidor:', error);
});
