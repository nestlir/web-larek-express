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

const product = Router();

product.get('/', getProducts);
product.post('/', validateProductBody, createProduct);
product.delete('/:productId', validateObjId, deleteProduct);
product.patch('/:productId', validateObjId, validateProductUpdateBody, updateProduct);

export default product;
