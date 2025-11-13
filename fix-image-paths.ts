import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixImagePaths() {
  try {
    const products = await prisma.products.findMany({
      where: {
        image: {
          not: null,
        },
      },
    });

    for (const product of products) {
      if (product.image) {
        let newImage = product.image;

        // Convert /src/uploads/ paths to /api/uploads/
        if (newImage.startsWith('/src/uploads/')) {
          newImage = newImage.replace('/src/uploads/', '/api/uploads/');
        }
        // Handle other variations
        else if (newImage.startsWith('src/uploads/')) {
          newImage = '/api/' + newImage;
        }
        else if (newImage.startsWith('/uploads/products/')) {
          newImage = '/api' + newImage;
        }
        else if (newImage.startsWith('uploads/products/')) {
          newImage = '/api/' + newImage;
        }

        if (newImage !== product.image) {
          await prisma.products.update({
            where: { id: product.id },
            data: { image: newImage },
          });
          console.log(`Updated product ${product.id}: ${product.image} -> ${newImage}`);
        }
      }
    }

    console.log('Image paths fixed successfully');
  } catch (error) {
    console.error('Error fixing image paths:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixImagePaths();
