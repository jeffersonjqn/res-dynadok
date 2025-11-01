import { Router } from 'express';
import { CustomerController} from '../controllers/customer.controller';

// definção das rotas da api

export const createCustomerRouter = (customerController: CustomerController) => {
  const router = Router();

  router.post('/customers', (req, res) => customerController.criar(req, res));
  router.get('/customers/:id', (req, res) => customerController.buscarPorId(req, res));
  router.get('/customers', (req, res) => customerController.listar(req, res));
  router.put('/customers/:id', (req, res) => customerController.atualizar(req, res));

  return router;
};
