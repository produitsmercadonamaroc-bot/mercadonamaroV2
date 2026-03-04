import { FieldValue, Timestamp } from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  availableStock?: number;
  initialStock?: number;
  isOrderBased?: boolean;
  category?: 'simple' | 'pack' | 'sur-commande';
  packItems?: PackItem[];
  totalSold?: number;
  createdAt?: any;
}

export interface PackItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  profit: number;
  date: number;
}

export interface Stats {
  revenue: number;
  profit: number;
  totalSold: number;
  stockValue: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  name:string;
  phone: string;
  address: string;
  city: string;
  items: { id: string; name: string; price: number; quantity: number }[];
  total: number;
  createdAt: FieldValue | Timestamp | string;
}