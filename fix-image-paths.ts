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

        if (newImage.startsWith('src/uploads/')) {
          newImage = '/' + newImage;
        }
        else if (newImage.startsWith('/uploads/products/')) {
          newImage = '/src' + newImage;
        }
        else if (newImage.startsWith('uploads/products/')) {
          newImage = '/src/' + newImage;
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
