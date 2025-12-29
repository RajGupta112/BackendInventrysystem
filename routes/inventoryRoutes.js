import express from 'express';
import { getInventory, updateStock } from '../controllers/inventoryController.js';
import { authMiddleware } from '../middleware/authmiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', getInventory);
router.post('/update', updateStock);

export default router;
