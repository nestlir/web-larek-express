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
<<<<<<< Updated upstream
import auth from '../middlewares/auth';
=======
>>>>>>> Stashed changes

const product = Router();

product.get('/', getProducts);
<<<<<<< Updated upstream
product.post('/', auth, validateProductBody, createProduct);
product.delete('/:productId', auth, validateObjId, deleteProduct);
product.patch('/:productId', auth, validateObjId, validateProductUpdateBody, updateProduct);
=======
product.post('/', validateProductBody, createProduct);
product.delete('/:productId', validateObjId, deleteProduct);
product.patch('/:productId', validateObjId, validateProductUpdateBody, updateProduct);
>>>>>>> Stashed changes

export default product;
