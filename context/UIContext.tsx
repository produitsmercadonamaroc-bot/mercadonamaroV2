import React, { createContext, useState, useCallback, ReactNode } from 'react';

interface UIContextType {
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isSearchOpen: boolean;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  toggleCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
}

// FIX: The previous attempt to provide a default context value resulted in typing errors. Reverting to the standard pattern of using `undefined` as the default and checking for it in the consumer hook. This ensures consumers are always within a provider.
export const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);

  const openCheckout = useCallback(() => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, []);
  
  const closeCheckout = useCallback(() => setIsCheckoutOpen(false), []);

  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchTerm('');
  }, []);


  return (
    <UIContext.Provider value={{ 
      isCartOpen, 
      isCheckoutOpen, 
      isSearchOpen,
      searchTerm,
      setSearchTerm,
      openCart, 
      closeCart, 
      openCheckout, 
      closeCheckout, 
      toggleCart,
      openSearch,
      closeSearch
    }}>
      {children}
    </UIContext.Provider>
  );
};