


import { useContext } from 'react';
import { UIContext } from '../context/UIContext';

// FIX: Re-added the context existence check. This pairs with the change in UIContext.tsx to ensure the hook is only used within a UIProvider, preventing runtime errors and fixing type inference issues.
export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
