import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => (
  <Link to="/" className="flex flex-col items-center group" aria-label="Produits Mercadona Maroc, back to homepage">
    <div className="w-auto h-16 flex items-center justify-center -mb-2">
        <span className="font-serif font-bold text-3xl tracking-tight text-primary group-hover:text-secondary transition-colors">
            PRODUITS
        </span>
    </div>
    <span className="text-xs font-semibold tracking-widest text-gray-500 group-hover:text-primary transition-colors">
      MERCADONA MAROC
    </span>
  </Link>
);

export default Logo;