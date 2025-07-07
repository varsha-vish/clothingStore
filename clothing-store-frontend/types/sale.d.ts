import { Product } from './product';

export interface SaleProduct extends Product {
    quantity: number;
}

export interface Sale {
    _id: string;
    userId: string;
    products: SaleProduct[];
    totalPrice: number | string;
    saleDate: string;
}