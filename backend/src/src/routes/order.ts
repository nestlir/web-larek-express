import { Router } from 'express';
import createOrder from '../controllers/order';
import { validateOrderBody } from '../middlewares/validations';
import auth from '../middlewares/auth';

const order = Router();

order.post('/', auth, validateOrderBody, createOrder);

export default order;
