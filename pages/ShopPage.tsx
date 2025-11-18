import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { useUI } from '../hooks/useUI';

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { searchTerm } = useUI();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollection);
        const productsList = productSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            stock: Number(data['availableStock']) || 0,
          } as Product
        });
        setProducts(productsList);
      } catch (err: any) {
        setError('Erreur de chargement des produits: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return products;
    }
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-serif font-bold mb-12 text-center text-primary">
        {searchTerm ? `Résultats pour "${searchTerm}"` : 'Nos Produits'}
      </h1>

      {products.length === 0 && !loading ? (
        <p className="text-center text-secondary">Aucun produit disponible pour le moment.</p>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <p className="text-center text-secondary">Aucun produit ne correspond à votre recherche.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShopPage;