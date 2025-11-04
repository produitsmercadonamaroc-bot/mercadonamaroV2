import React from 'react';
import Modal from './Modal';
import { useCart } from '../hooks/useCart';
import { useUI } from '../hooks/useUI';
import { CartItem } from '../types';

const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();

    return (
        <div className="flex items-start justify-between py-5">
            <div className="flex items-start space-x-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-contain border border-gray-200 rounded-md" />
                <div className="flex flex-col">
                    <p className="font-semibold text-primary text-sm">{item.name}</p>
                    <p className="text-xs text-secondary mt-1">{item.salePrice.toFixed(2)} dh</p>
                    <div className="flex items-center border border-gray-200 rounded-md mt-3">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-lg text-secondary hover:bg-gray-100 transition-colors">-</button>
                        <span className="px-3 text-sm font-medium w-10 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-lg text-secondary hover:bg-gray-100 transition-colors">+</button>
                    </div>
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold text-primary text-sm">{ (item.salePrice * item.quantity).toFixed(2) } dh</p>
                 <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 mt-10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

const CartModal: React.FC = () => {
  const { isCartOpen, closeCart, openCheckout } = useUI();
  const { cartItems, cartTotal } = useCart();

  const handleCheckout = () => {
    closeCart();
    openCheckout();
  };

  return (
    <Modal isOpen={isCartOpen} onClose={closeCart} position="right">
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-serif font-semibold text-primary">Votre panier</h2>
                <button onClick={closeCart} className="text-secondary hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            {cartItems.length === 0 ? (
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-center text-secondary">Votre panier est vide.</p>
                </div>
            ) : (
                <div className="flex-grow overflow-y-auto px-6 divide-y divide-gray-200">
                    {cartItems.map(item => <CartItemRow key={item.id} item={item} />)}
                </div>
            )}

            {cartItems.length > 0 && (
                <div className="bg-white p-6 border-t border-gray-200">
                    <div className="flex justify-between items-baseline mb-4">
                        <span className="text-md font-semibold text-primary">Total estimé</span>
                        <span className="text-xl font-bold text-primary">{cartTotal.toFixed(2)} DH</span>
                    </div>
                    <p className="text-xs text-secondary text-left mb-4">Taxes, réductions et frais d'expédition calculés à l'étape du paiement.</p>
                    <button
                        onClick={handleCheckout}
                        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 hover:bg-gray-800 flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        ACHETER MAINTENANT
                    </button>
                </div>
            )}
        </div>
    </Modal>
  );
};

export default CartModal;