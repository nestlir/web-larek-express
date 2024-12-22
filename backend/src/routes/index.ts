import { Router } from 'express';
import productRoutes from './product';
import orderRoutes from './order';
<<<<<<< Updated upstream
import authRoutes from './auth';
=======
>>>>>>> Stashed changes

const router = Router();

router.use('/product', productRoutes);
router.use('/order', orderRoutes);
<<<<<<< Updated upstream
router.use('/auth', authRoutes);
=======
>>>>>>> Stashed changes

export default router;
