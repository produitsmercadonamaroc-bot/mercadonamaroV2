
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, Sale } from '../types';

const PRODUCTS_COL = 'products';
const SALES_COL = 'sales';

// Helper pour nettoyer les nombres
const cleanNum = (val: any): number => {
  const n = Number(val);
  return isNaN(n) ? 0 : n;
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const q = query(collection(db, PRODUCTS_COL), orderBy('name'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => {
      const data = doc.data();
      const rawStock = data.availableStock ?? data.stock ?? data.initialStock ?? 0;
      return {
        id: doc.id,
        ...data,
        purchasePrice: cleanNum(data.purchasePrice),
        salePrice: cleanNum(data.salePrice ?? data.price),
        stock: cleanNum(rawStock),
        totalSold: cleanNum(data.totalSold),
        category: data.category || 'simple'
      } as Product;
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getSales = async (): Promise<Sale[]> => {
  try {
    const snap = await getDocs(collection(db, SALES_COL));
    return snap.docs.map(doc => {
      const data = doc.data();
      // Handle both Firestore Timestamps and raw numbers for the date
      let dateValue = data.date;
      if (dateValue && typeof dateValue.toMillis === 'function') {
        dateValue = dateValue.toMillis();
      }
      
      return {
        id: doc.id,
        ...data,
        date: dateValue || Date.now(),
        totalPrice: cleanNum(data.totalPrice),
        profit: cleanNum(data.profit),
        quantity: cleanNum(data.quantity)
      } as Sale;
    });
  } catch (error) {
    console.warn("Error fetching sales:", error);
    return [];
  }
};

export const addProductToDb = async (product: Omit<Product, 'id'>) => {
  const data = {
    ...product,
    purchasePrice: cleanNum(product.purchasePrice),
    salePrice: cleanNum(product.salePrice),
    availableStock: cleanNum(product.stock),
    initialStock: cleanNum(product.stock),
    stock: cleanNum(product.stock),
    createdAt: serverTimestamp()
  };
  const docRef = await addDoc(collection(db, PRODUCTS_COL), data);
  return { id: docRef.id, ...data } as Product;
};

export const updateProductInDb = async (id: string, updates: Partial<Product>) => {
  const docRef = doc(db, PRODUCTS_COL, id);
  const cleanUpdates: any = { ...updates };
  if (updates.salePrice !== undefined) cleanUpdates.salePrice = cleanNum(updates.salePrice);
  if (updates.purchasePrice !== undefined) cleanUpdates.purchasePrice = cleanNum(updates.purchasePrice);
  if (updates.stock !== undefined) {
    cleanUpdates.availableStock = cleanNum(updates.stock);
    cleanUpdates.stock = cleanNum(updates.stock);
  }
  await updateDoc(docRef, cleanUpdates);
};

export const deleteProductFromDb = async (id: string) => {
  await deleteDoc(doc(db, PRODUCTS_COL, id));
};

export const addSaleToDb = async (sale: Omit<Sale, 'id'>, currentStock: number) => {
  // 1. Enregistrer la vente dans la collection 'sales'
  const saleRef = await addDoc(collection(db, SALES_COL), {
    ...sale,
    date: Date.now() // Timestamp local pour le tri immédiat
  });
  
  // 2. Mettre à jour le produit (stock et total des ventes)
  const productRef = doc(db, PRODUCTS_COL, sale.productId);
  
  try {
    await updateDoc(productRef, {
      availableStock: increment(-sale.quantity),
      stock: increment(-sale.quantity),
      totalSold: increment(sale.quantity)
    });
  } catch (err) {
    console.error("Failed to update product stock, but sale was recorded:", err);
  }

  return saleRef.id;
};
