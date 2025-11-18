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
        // Fetch 5 products to have enough to show 4 related ones after filtering
        const q = query(productsRef, limit(5));
        const querySnapshot = await getDocs(q);

        const relatedProducts = querySnapshot.docs
          .map(doc => {
            const data = doc.data();
            return { 
              id: doc.id, 
              ...data,
              stock: Number(data['availableStock']) || 0,
            } as Product
          })
          .filter(p => p.id !== currentProductId)
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

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-20 pt-16 border-t border-gray-200">
      <h2 className="text-3xl font-serif font-bold text-center mb-10 text-primary">You may also like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;