# TODO: Ubah Schema Prisma untuk Simpan Gambar Langsung ke Kolom Image Products

- [ ] Edit prisma/schema.prisma: Hapus relasi images dari model products, hapus model images
- [ ] Update src/controllers/productController.ts: Ubah createProduct dan updateProduct untuk menyimpan imageUrl ke kolom image
- [ ] Update client/src/components/ProductCard.tsx: Ubah imageUrl untuk menggunakan product.image langsung
- [ ] Run prisma migrate dev untuk update database
- [ ] Test aplikasi untuk memastikan gambar ditampilkan dengan benar
