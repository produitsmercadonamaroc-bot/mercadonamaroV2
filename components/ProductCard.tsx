import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

// Image placeholder simple et légère (SVG encodé)
const PLACEHOLDER_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22400%22%20viewBox%3D%220%200%20400%20400%22%3E%3Crect%20width%3D%22400%22%20height%3D%22400%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2220%22%20fill%3D%22%239ca3af%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3EImage%20non%20disponible%3C%2Ftext%3E%3C%2Fsvg%3E";

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, name, image, salePrice, stock } = product;
  const isOutOfStock = stock !== undefined && stock <= 0;
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Si l'image ne charge pas, on met le placeholder
    e.currentTarget.src = PLACEHOLDER_IMAGE;
    e.currentTarget.onerror = null; // Empêche une boucle infinie si le placeholder échoue aussi
  };

  return (
    <Link to={`/ma/product/${id}`} className={`group block ${isOutOfStock ? 'cursor-not-allowed' : ''}`}>
      <div className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${isOutOfStock ? 'bg-gray-50' : 'group-hover:shadow-lg group-hover:border-primary'}`}>
        <div className="aspect-square bg-accent overflow-hidden relative">
          <img
            className={`w-full h-full object-contain transition-transform duration-300 p-4 ${isOutOfStock ? 'opacity-60' : 'group-hover:scale-105'}`}
            // On utilise l'image du produit, sinon le placeholder. Plus d'images aléatoires.
            src={image || PLACEHOLDER_IMAGE}
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