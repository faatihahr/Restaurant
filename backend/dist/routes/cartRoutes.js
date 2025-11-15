import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart, } from '../controllers/cartController.js';
const router = Router();
router.get('/', getCart);
router.post('/add-to-cart', addToCart);
router.put('/update-item', updateCartItem);
router.delete('/remove-item', removeFromCart);
router.delete('/clear', clearCart);
export default router;
//# sourceMappingURL=cartRoutes.js.map