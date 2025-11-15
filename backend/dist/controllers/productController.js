import path from 'path';
import prisma from '../lib/prisma.js';
import { saveUploadedFile, validateImageFile, getUploadedFiles } from '../lib/upload.js';
export const getProducts = async (req, res) => {
    try {
        const { category, sort, limit, offset, search } = req.query;
        const where = {};
        if (category) {
            where.categoryId = parseInt(category);
        }
        if (search) {
            where.name = {
                contains: search,
                mode: 'insensitive'
            };
        }
        const orderBy = {};
        if (sort) {
            const [field, direction] = sort.split(':');
            if (field) {
                orderBy[field] = direction === 'desc' ? 'desc' : 'asc';
            }
        }
        const take = limit ? parseInt(limit) : undefined;
        const skip = offset ? parseInt(offset) : undefined;
        const products = await prisma.products.findMany({
            where,
            orderBy,
            take,
            skip,
            include: {
                category: true,
                favorites: true,
                reviews: true
            }
        });
        res.json({ message: 'Products fetched successfully', data: products });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
};
export const getProductById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const product = await prisma.products.findUnique({
            where: { id }
        });
        if (product) {
            res.json({ message: 'Product fetched successfully', data: product });
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
};
export const createProduct = async (req, res) => {
    const { name, price, description, categoryId } = req.body;
    if (!name || !price || !description || !categoryId) {
        return res.status(400).json({ message: 'Name, price, description, and categoryId are required' });
    }
    try {
        // Handle single product image from multer
        let imageUrl;
        if (req.file) {
            const file = req.file;
            // Additional validation: Check for empty files
            if (file.size === 0) {
                return res.status(400).json({ message: 'Image file is empty.' });
            }
            // Check filename for path traversal attempts
            if (file.originalname.includes('..') || file.originalname.includes('/') || file.originalname.includes('\\')) {
                return res.status(400).json({ message: 'Invalid filename detected.' });
            }
            // Validate image file
            if (!validateImageFile(file)) {
                return res.status(400).json({ message: 'Invalid image file. Only JPEG, PNG, GIF, and WebP files up to 10MB are allowed.' });
            }
            // File is already saved by multer, just return the path
            const relativePath = path.relative(path.join(process.cwd(), 'src'), file.path);
            imageUrl = `/api/${relativePath.replace(/\\/g, '/')}`;
        }
        else {
            return res.status(400).json({ message: 'Product image is required' });
        }
        const newProduct = await prisma.products.create({
            data: {
                name,
                price: parseFloat(price),
                description,
                categoryId: parseInt(categoryId),
                image: imageUrl
            },
            include: {
                category: true
            }
        });
        res.status(201).json({ message: 'Product created successfully', data: newProduct });
    }
    catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};
export const updateProduct = async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price, description, categoryId } = req.body;
    try {
        // Handle single product image from multer
        let imageUrl;
        if (req.file) {
            const file = req.file;
            // Additional validation: Check for empty files
            if (file.size === 0) {
                return res.status(400).json({ message: 'Image file is empty.' });
            }
            // Check filename for path traversal attempts
            if (file.originalname.includes('..') || file.originalname.includes('/') || file.originalname.includes('\\')) {
                return res.status(400).json({ message: 'Invalid filename detected.' });
            }
            // Validate image file
            if (!validateImageFile(file)) {
                return res.status(400).json({ message: 'Invalid image file. Only JPEG, PNG, GIF, and WebP files up to 10MB are allowed.' });
            }
            // File is already saved by multer, just return the path
            const relativePath = path.relative(path.join(process.cwd(), 'src'), file.path);
            imageUrl = `/api/${relativePath.replace(/\\/g, '/')}`;
        }
        const updateData = {
            ...(name !== undefined && { name }),
            ...(price !== undefined && { price }),
            ...(description !== undefined && { description }),
            ...(categoryId !== undefined && { categoryId }),
            ...(imageUrl !== undefined && { image: imageUrl })
        };
        const updatedProduct = await prisma.products.update({
            where: { id },
            data: updateData,
            include: {
                category: true
            }
        });
        res.json({ message: 'Product updated successfully', data: updatedProduct });
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Product not found' });
        }
        else {
            res.status(500).json({ message: 'Error updating product', error });
        }
    }
};
export const deleteProduct = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const deletedProduct = await prisma.products.delete({
            where: { id }
        });
        res.json({ message: 'Product deleted successfully', data: deletedProduct });
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Product not found' });
        }
        else {
            res.status(500).json({ message: 'Error deleting product', error });
        }
    }
};
export const getProductsByCategory = async (req, res) => {
    try {
        const { categoryName } = req.params;
        if (!categoryName) {
            return res.status(400).json({ message: 'Category name is required' });
        }
        const { limit, offset } = req.query;
        const categoryMap = {
            food: 'Food',
            beverages: 'Beverages'
        };
        const dbCategoryName = categoryMap[categoryName.toLowerCase()];
        if (!dbCategoryName) {
            return res.status(400).json({ message: 'Invalid category name. Use "food" or "beverages".' });
        }
        const take = limit ? parseInt(limit) : undefined;
        const skip = offset ? parseInt(offset) : undefined;
        const products = await prisma.products.findMany({
            where: {
                category: {
                    name: dbCategoryName
                }
            },
            take,
            skip,
            include: {
                category: true,
                favorites: true,
                reviews: true
            }
        });
        const grouped = {
            [dbCategoryName]: products
        };
        res.json({ message: 'Products by category fetched successfully', data: grouped });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching products by category', error });
    }
};
//# sourceMappingURL=productController.js.map