import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductsByCategory, } from '../controllers/productController.js';
import { authorize } from '../middleware/auth-middleware.js';
import { uploadRateLimit, productRateLimit } from '../middleware/rate-limit-middleware.js';
import { uploadMiddleware } from '../middleware/upload-middleware.js';
// Public routes (no authentication required)
const publicRouter = Router();
publicRouter.get('/', getProducts);
publicRouter.get('/category/:categoryName', getProductsByCategory);
publicRouter.get('/:id', getProductById);
// Authenticated routes (require authentication)
const authenticatedRouter = Router();
authenticatedRouter.post('/createprd', uploadRateLimit, authorize(['admin']), uploadMiddleware.single('productImage'), createProduct);
authenticatedRouter.put('/update/:id', productRateLimit, authorize(['admin']), uploadMiddleware.single('productImage'), updateProduct);
authenticatedRouter.delete('/:id', productRateLimit, authorize(['admin']), deleteProduct);
export { publicRouter, authenticatedRouter };
//# sourceMappingURL=productRoutes.js.map