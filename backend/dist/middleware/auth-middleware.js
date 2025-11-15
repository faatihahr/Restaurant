import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Pakai environment variable di production
export const authenticate = async (req, res, next) => {
    try {
        // ambil token dari session
        let token = req.session?.token;
        if (!token) {
            token = req.cookies?.token;
        }
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7); // Hapus prefix 'Bearer '
            }
        }
        if (!token) {
            return next();
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, role: true }
        });
        if (!user) {
            return next();
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
};
export const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new Error('Authentication required');
        }
        if (!roles.includes(req.user.role)) {
            throw new Error('Access denied');
        }
        next();
    };
};
//# sourceMappingURL=auth-middleware.js.map