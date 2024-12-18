import { Router } from 'express';
import {
  validateProductBody,
  validateProductUpdateBody,
  validateObjId,
} from '../middlewares/validations';
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from '../controllers/product';
import auth from '../middlewares/auth';

const product = Router();

product.get('/', getProducts);
product.post('/', auth, validateProductBody, createProduct);
product.delete('/:productId', auth, validateObjId, deleteProduct);
product.patch('/:productId', auth, validateObjId, validateProductUpdateBody, updateProduct);

export default product;
