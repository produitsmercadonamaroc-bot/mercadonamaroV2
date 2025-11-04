


import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

// FIX: Re-added the context existence check. This pairs with the change in CartContext.tsx to ensure the hook is only used within a CartProvider, preventing runtime errors and fixing type inference issues.
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
