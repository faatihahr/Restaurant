import prisma from '../lib/prisma.js';
export const getCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const sessionId = req.sessionID; // Type assertion for session
        const whereCondition = userId
            ? { userId, status: 'cart' }
            : { guestSessionId: sessionId, status: 'cart' };
        const cartOrder = await prisma.orders.findFirst({
            where: whereCondition,
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });
        const cartItems = cartOrder ? cartOrder.items.map((item) => ({
            product: item.product,
            quantity: item.quantity
        })) : [];
        res.json({ message: 'Cart fetched successfully', data: cartItems });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error });
    }
};
export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const userId = req.user?.id;
        const sessionId = req.sessionID;
        console.log('addToCart - userId:', userId, 'sessionId:', sessionId, 'session:', req.session);
        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Product ID and positive quantity are required' });
        }
        // Ambil product untuk price
        const product = await prisma.products.findUnique({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Cari order cart
        const whereCondition = userId
            ? { userId, status: 'cart' }
            : { guestSessionId: sessionId, status: 'cart' };
        let cartOrder = await prisma.orders.findFirst({
            where: whereCondition,
            select: { id: true }
        });
        if (!cartOrder) {
            // Buat order cart baru
            const orderData = userId ? { userId } : { guestSessionId: sessionId };
            cartOrder = await prisma.orders.create({
                data: {
                    ...orderData,
                    totalPrice: 0, // Akan diupdate saat checkout
                    status: 'cart'
                }
            });
        }
        // Cek orderItem untuk product
        const existingItem = await prisma.orderItems.findFirst({
            where: {
                orderId: cartOrder.id,
                productId
            }
        });
        if (existingItem) {
            // Update quantity
            await prisma.orderItems.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            });
        }
        else {
            // Buat item baru
            await prisma.orderItems.create({
                data: {
                    orderId: cartOrder.id,
                    productId,
                    quantity,
                    price: product.price * quantity
                }
            });
        }
        res.json({ message: 'Product added to cart successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding product to cart', error });
    }
};
export const updateCartItem = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const userId = req.user?.id;
        const sessionId = req.sessionID;
        console.log('updateCartItem - userId:', userId, 'sessionId:', sessionId, 'productId:', productId, 'quantity:', quantity);
        if (!productId || quantity < 0) {
            return res.status(400).json({ message: 'Product ID and quantity (0 or more) are required' });
        }
        // Cari order cart
        const whereCondition = userId
            ? { userId, status: 'cart' }
            : { guestSessionId: sessionId, status: 'cart' };
        const cartOrder = await prisma.orders.findFirst({
            where: whereCondition
        });
        if (!cartOrder) {
            return res.status(404).json({ message: 'No cart found' });
        }
        if (quantity === 0) {
            // Hapus item
            await prisma.orderItems.deleteMany({
                where: {
                    orderId: cartOrder.id,
                    productId
                }
            });
        }
        else {
            // Update quantity
            const updatedItem = await prisma.orderItems.updateMany({
                where: {
                    orderId: cartOrder.id,
                    productId
                },
                data: { quantity }
            });
            if (updatedItem.count === 0) {
                return res.status(404).json({ message: 'Product not in cart' });
            }
        }
        res.json({ message: 'Cart item updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating cart item', error });
    }
};
export const removeFromCart = async (req, res) => {
    const { productId } = req.body;
    try {
        const userId = req.user?.id;
        const sessionId = req.sessionID;
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        // Cari order cart
        const whereCondition = userId
            ? { userId, status: 'cart' }
            : { guestSessionId: sessionId, status: 'cart' };
        const cartOrder = await prisma.orders.findFirst({
            where: whereCondition
        });
        if (!cartOrder) {
            return res.status(404).json({ message: 'No cart found' });
        }
        await prisma.orderItems.deleteMany({
            where: {
                orderId: cartOrder.id,
                productId
            }
        });
        res.json({ message: 'Product removed from cart successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error removing product from cart', error });
    }
};
export const clearCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const sessionId = req.sessionID;
        // Cari order cart
        const whereCondition = userId
            ? { userId, status: 'cart' }
            : { guestSessionId: sessionId, status: 'cart' };
        const cartOrder = await prisma.orders.findFirst({
            where: whereCondition
        });
        if (cartOrder) {
            await prisma.orders.delete({ where: { id: cartOrder.id } });
        }
        res.json({ message: 'Cart cleared successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error });
    }
};
//# sourceMappingURL=cartController.js.map