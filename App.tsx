import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { UIProvider } from './context/UIContext';
import Header from './components/Header';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';
import { useUI } from './hooks/useUI';

const ContactPage = () => (
    <div className="text-center py-20">
        <h1 className="text-4xl font-serif font-bold mb-4">Contactez-nous</h1>
        <p className="text-secondary">Pour toute question, veuillez nous envoyer un email à contact@mercadonamaroc.com</p>
        <Link to="/" className="mt-8 inline-block text-primary font-semibold border-b-2 border-primary pb-1">Retour à l'accueil</Link>
    </div>
);

const UIEffects: React.FC = () => {
    const { closeSearch } = useUI();
    const location = useLocation();

    useEffect(() => {
        closeSearch();
    }, [location.pathname, closeSearch]);

    return null;
}


const App: React.FC = () => {
  return (
    <UIProvider>
      <CartProvider>
        <HashRouter>
          <UIEffects />
          <div className="flex flex-col min-h-screen font-sans">
            <Header />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
              <Routes>
                <Route path="/" element={<ShopPage category="all" />} />
                <Route path="/packs" element={<ShopPage category="pack" />} />
                <Route path="/sur-commande" element={<ShopPage category="sur-commande" />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
              </Routes>
            </main>
            <footer className="bg-white py-8 border-t border-gray-200">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-secondary text-sm">
                    <p>&copy; {new Date().getFullYear()} PRODUITS MERCADONA MAROC. Tous droits réservés.</p>
                </div>
            </footer>
          </div>
          <CartModal />
          <CheckoutModal />
        </HashRouter>
      </CartProvider>
    </UIProvider>
  );
};

export default App;