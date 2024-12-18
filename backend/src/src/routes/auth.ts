import { Router } from 'express';
import {
  login,
  register,
  refreshAccessToken,
  logout,
  getCurrentUser,
} from '../controllers/auth';
import authMiddleware from '../middlewares/auth';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/token', refreshAccessToken);
router.get('/logout', authMiddleware, logout);
router.get('/user', authMiddleware, getCurrentUser);

export default router;
