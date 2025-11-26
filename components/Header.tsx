import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useUI } from '../hooks/useUI';
import Logo from './Logo';

const Header: React.FC = () => {
  const { cartCount } = useCart();
  const { isSearchOpen, openSearch, closeSearch, searchTerm, setSearchTerm, openCart } = useUI();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium uppercase tracking-wider transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-secondary'}`;

  return (
    <>
      <div className="bg-primary text-white text-center py-2 text-xs font-semibold tracking-widest uppercase">
        Livraison gratuite +500 DH
      </div>
      <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-200">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 relative">
            <button onClick={openSearch} aria-label="Rechercher" className="text-primary hover:text-secondary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Logo />
            </div>

            <button
              onClick={openCart}
              className="relative text-primary hover:text-secondary transition-colors"
              aria-label={`Ouvrir le panier avec ${cartCount} articles`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
          
          {isSearchOpen ? (
            <div className="py-4 animate-fade-in-scale">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Que cherchez-vous ?"
                        className="w-full pl-12 pr-12 py-3 text-base border border-gray-300 rounded-full focus:ring-primary focus:border-primary transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <button onClick={closeSearch} aria-label="Fermer la recherche" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
          ) : (
            <nav className="flex justify-center items-center gap-8 py-4">
              <NavLink to="/" className={navLinkClass}>Accueil</NavLink>
              <NavLink to="/packs" className={navLinkClass}>Nos Packs</NavLink>
              <NavLink to="/sur-commande" className={navLinkClass}>Sur commande</NavLink>
              <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;