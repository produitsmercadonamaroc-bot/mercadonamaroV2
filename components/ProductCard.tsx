import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, name, image, salePrice, stock } = product;
  const isOutOfStock = stock !== undefined && stock <= 0;
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = `https://picsum.photos/seed/${id}/400/400`;
  };

  return (
    <Link to={`/product/${id}`} className={`group block ${isOutOfStock ? 'cursor-not-allowed' : ''}`}>
      <div className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${isOutOfStock ? 'bg-gray-50' : 'group-hover:shadow-lg group-hover:border-primary'}`}>
        <div className="aspect-square bg-accent overflow-hidden relative">
          <img
            className={`w-full h-full object-contain transition-transform duration-300 p-4 ${isOutOfStock ? 'opacity-60' : 'group-hover:scale-105'}`}
            src={image || `https://picsum.photos/seed/${id}/400/400`}
            alt={name}
            onError={handleImageError}
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center">
              <span className="text-primary text-sm font-bold uppercase tracking-wider bg-white/80 px-4 py-2 rounded-full shadow-sm">Épuisé</span>
            </div>
          )}
        </div>
        <div className={`p-4 text-center ${isOutOfStock ? 'bg-gray-50' : 'bg-white'}`}>
          <h3 className={`font-serif text-lg capitalize truncate transition-colors duration-300 ${isOutOfStock ? 'text-gray-500' : 'text-primary group-hover:text-secondary'}`} title={name}>
            {name}
          </h3>
          <p className={`mt-1 text-base font-semibold ${isOutOfStock ? 'text-gray-400' : 'text-secondary'}`}>
            {salePrice.toFixed(2)} DH
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;