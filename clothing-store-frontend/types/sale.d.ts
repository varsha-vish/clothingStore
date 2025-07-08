// types/sale.ts
export interface SaleProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  description?: string;
  category?: string;
}

export interface Sale {
  id: string; 
  userId: string;
  products: SaleProduct[];
  totalPrice: number;
  saleDate: string; 
  createdAt?: string;
  updatedAt?: string;
}