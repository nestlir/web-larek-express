import { Router } from 'express';
import productRoutes from './product';
import orderRoutes from './order';
import authRoutes from './auth';

const router = Router();

router.use('/product', productRoutes);
router.use('/order', orderRoutes);
router.use('/auth', authRoutes);

export default router;
