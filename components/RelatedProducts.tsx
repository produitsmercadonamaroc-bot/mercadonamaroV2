import React, { useState, useEffect } from 'react';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
  currentProductId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProductId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        const productsRef = collection(db, 'products');
        const q = query(productsRef, limit(10));
        const querySnapshot = await getDocs(q);

        const relatedProducts = querySnapshot.docs
          .map(doc => {
            const data = doc.data();
            
            const rawStock = data['availableStock'] ?? data['stock'] ?? 0;
            const stockValue = isNaN(Number(rawStock)) ? 0 : Number(rawStock);

            const salePriceValue = Number(data['salePrice'] ?? data['SALE PRICE'] ?? data['price'] ?? 0);

            return { 
              id: doc.id, 
              ...data,
              salePrice: salePriceValue,
              stock: stockValue,
            } as Product
          })
          .filter(p => p.id !== currentProductId)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        
        setProducts(relatedProducts);
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId]);

  if (loading || products.length === 0) return null;

  return (
    <div className="mt-20 pt-16 border-t border-gray-200">
      <h2 className="text-3xl font-serif font-bold text-center mb-10 text-primary">Vous aimerez aussi</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;