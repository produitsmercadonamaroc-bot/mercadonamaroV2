import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Product } from '../types';
import Modal from './Modal';
import { useUI } from '../hooks/useUI';
import Spinner from './Spinner';

const SearchModal: React.FC = () => {
  const { isSearchOpen, closeSearch } = useUI();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSearchOpen && allProducts.length === 0) {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const productsCollection = collection(db, 'products');
          const productSnapshot = await getDocs(productsCollection);
          const productsList = productSnapshot.docs.map(doc => {
            const data = doc.data();
            // Prioritize 'stock' field
            const stockValue = data['stock'] !== undefined 
            ? Number(data['stock']) 
            : (Number(data['availableStock']) || Number(data['Stock Initial']) || 0);

            return {
              id: doc.id,
              ...data,
              stock: stockValue,
            } as Product
          });
          setAllProducts(productsList);
        } catch (err) {
          console.error("Erreur de chargement des produits pour la recherche:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [isSearchOpen, allProducts.length]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    return allProducts.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allProducts]);

  const handleClose = () => {
    setSearchTerm('');
    closeSearch();
  };

  return (
    <Modal isOpen={isSearchOpen} onClose={handleClose} position="center">
      <div className="flex flex-col h-full w-full max-w-2xl mx-auto bg-white rounded-lg shadow-xl">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="w-full pl-12 pr-4 py-3 text-lg border-0 focus:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto p-4">
          {loading && <Spinner />}
          {!loading && searchTerm && filteredProducts.length === 0 && (
            <p className="text-center text-secondary py-8">
              Aucun produit trouvé pour "{searchTerm}"
            </p>
          )}
          {filteredProducts.length > 0 && (
            <ul className="divide-y divide-gray-100">
              {filteredProducts.map(product => (
                <li key={product.id}>
                  <Link to={`/product/${product.id}`} onClick={handleClose} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-contain border border-gray-200 rounded-md" />
                    <div className="flex-grow">
                      <p className="font-semibold text-primary">{product.name}</p>
                      <p className="text-sm text-secondary">{product.salePrice.toFixed(2)} DH</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SearchModal;