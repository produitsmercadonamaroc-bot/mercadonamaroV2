import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { useUI } from '../hooks/useUI';

interface ShopPageProps {
  category?: 'all' | 'pack' | 'sur-commande';
}

const ShopPage: React.FC<ShopPageProps> = ({ category = 'all' }) => {
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
          
          // Mapping intelligent du stock basé sur la capture d'écran (availableStock est prioritaire)
          const rawStock = data['availableStock'] ?? data['stock'] ?? data['initialStock'] ?? 0;
          const stockValue = isNaN(Number(rawStock)) ? 0 : Number(rawStock);

          const salePriceValue = Number(data['salePrice'] ?? data['SALE PRICE'] ?? data['price'] ?? 0);

          return {
            id: doc.id,
            ...data,
            salePrice: salePriceValue,
            stock: stockValue,
            isOrderBased: data['isOrderBased'] ?? false,
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
    let filtered = products;

    if (category === 'pack') {
      filtered = filtered.filter(p => 
        (p.name?.toLowerCase().includes('pack') || 
         (p.category && p.category.toLowerCase() === 'pack')) &&
        !p.isOrderBased
      );
    } else if (category === 'sur-commande') {
      filtered = filtered.filter(p => p.isOrderBased === true);
    } else {
      filtered = filtered.filter(p => !p.isOrderBased);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    return filtered;
  }, [products, searchTerm, category]);

  const getPageTitle = () => {
    if (searchTerm) return `Résultats pour "${searchTerm}"`;
    switch (category) {
      case 'pack': return 'Nos Packs';
      case 'sur-commande': return 'Sur Commande';
      default: return 'Nos Produits';
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-serif font-bold mb-12 text-center text-primary">
        {getPageTitle()}
      </h1>

      {products.length === 0 && !loading ? (
        <p className="text-center text-secondary">Aucun produit disponible pour le moment.</p>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <p className="text-center text-secondary">Aucun produit ne correspond à vos critères.</p>
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