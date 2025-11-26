import { FieldValue, Timestamp } from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  salePrice: number;
  stock?: number;
  isOrderBased?: boolean;
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