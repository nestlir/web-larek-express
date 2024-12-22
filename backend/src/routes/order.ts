import { Router } from 'express';
import createOrder from '../controllers/order';
import { validateOrderBody } from '../middlewares/validations';

const order = Router();

order.post('/', validateOrderBody, createOrder);

export default order;
