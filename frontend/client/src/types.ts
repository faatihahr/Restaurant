export interface Product {
  id: number;
  categoryId: number;
  name: string;
  description: string | null;
  price: number;
  images: Image[];
  category: Category;
  favorites: any[];
  reviews: any[];
  createdAt: string;
  updatedAt: string;
  isAvailable: boolean;
  isArchived: boolean;
  image: string | null;
}

export interface Image {
  id: string;
  productId: number;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: {
    id: number;
    name: string;
    price: number;
    image: string | null;
  };
  quantity: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  point: number;
  profileImage: string | null;
  createdAt: string;
}
