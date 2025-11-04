import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, name, image, salePrice } = product;
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = `https://picsum.photos/seed/${id}/400/400`;
  };

  return (
    <Link to={`/product/${id}`} className="group block">
      <div className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:border-primary">
        <div className="aspect-square bg-accent overflow-hidden relative">
          <img
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 p-4"
            src={image || `https://picsum.photos/seed/${id}/400/400`}
            alt={name}
            onError={handleImageError}
          />
        </div>
        <div className="p-4 text-center bg-white">
          <h3 className="font-serif text-lg text-primary capitalize truncate group-hover:text-secondary transition-colors duration-300" title={name}>
            {name}
          </h3>
          <p className="mt-1 text-base font-semibold text-secondary">
            {salePrice.toFixed(2)} DH
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;