import { Router } from 'express';
import createOrder from '../controllers/order';
import { validateOrderBody } from '../middlewares/validations';
<<<<<<< Updated upstream
import auth from '../middlewares/auth';

const order = Router();

order.post('/', auth, validateOrderBody, createOrder);
=======

const order = Router();

order.post('/', validateOrderBody, createOrder);
>>>>>>> Stashed changes

export default order;
