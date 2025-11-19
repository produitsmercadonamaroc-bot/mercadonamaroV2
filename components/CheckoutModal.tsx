import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useUI } from '../hooks/useUI';
import { useCart } from '../hooks/useCart';
import { Order } from '../types';
import { getDeliveryFee, getCityList } from '../utils/shippingData';

//  👇👇👇 LIEN LI GHATJIB MEN APPS SCRIPT, LصقO HNA 👇👇👇
const GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzm0RVh06-qE7x7r6J0NWdwo8EOj2O91RILusXZ30g5YD-5kVN-GoLze-seZAFvtpDMQw/exec'; // <-- 👈 BDEL HNA!

const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, closeCheckout } = useUI();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', city: '' });
  const [deliveryFee, setDeliveryFee] = useState(0); // Default to 0
  const [error, setError] = useState('');
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  
  const cityList = getCityList();

  useEffect(() => {
    if (formData.city && formData.city.trim() !== '') {
        const fee = getDeliveryFee(formData.city);
        setDeliveryFee(fee);
    } else {
        setDeliveryFee(0);
    }
  }, [formData.city]);

  const finalTotal = cartTotal + deliveryFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  
  const handleClose = () => {
    closeCheckout();
    // Reset state after modal closes to prevent UI flashes on reopen
    setTimeout(() => {
        setIsOrderSuccess(false);
        setFormData({ name: '', phone: '', address: '', city: '' });
        setError('');
        setDeliveryFee(0);
    }, 300); // Should match modal animation duration
  };


  const logOrderToSheet = async (orderData: Omit<Order, 'createdAt'>) => {
    if (!GOOGLE_SHEET_WEB_APP_URL) {
      console.warn('Google Sheet URL not configured. Skipping sheet logging.');
      return;
    }
    const itemsString = orderData.items.map(item => `${item.name} (x${item.quantity})`).join(', ');
    
    // Format: Prix produits + Prix livraison (ex: 26.00dh + 20.00dh)
    const formattedTotal = `${cartTotal.toFixed(2)}dh + ${deliveryFee.toFixed(2)}dh`;

    const rowData = {
      'Date': new Date().toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      'Nom Client': orderData.name,
      'Téléphone': orderData.phone,
      'Adresse': orderData.address,
      'Ville': orderData.city,
      'Total (DH)': formattedTotal,
      'Produits': itemsString,
    };
    try {
      await fetch(GOOGLE_SHEET_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(rowData),
      });
    } catch (sheetError) {
      console.error("Could not send order to Google Sheet:", sheetError);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError('Votre panier est vide.');
      return;
    }
    setError('');

    const orderForSheet: Omit<Order, 'createdAt'> = {
        ...formData,
        items: cartItems.map(({ id, name, salePrice, quantity }) => ({ id, name, price: salePrice, quantity })),
        total: finalTotal,
    };

    // 1. Send to Google Sheet in the background (fire and forget).
    logOrderToSheet(orderForSheet);

    // 2. Show success to the user immediately.
    clearCart();
    setIsOrderSuccess(true);
  };

  if (!isCheckoutOpen) return null;

  return (
    <Modal isOpen={isCheckoutOpen} onClose={handleClose}>
        {isOrderSuccess ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-serif font-bold text-green-700">Commande validée avec succès !</h2>
                <p className="mt-2 text-secondary max-w-sm">
                    Merci pour votre achat. Nous vous contacterons bientôt pour confirmer les détails de la livraison.
                </p>
                <button
                    onClick={handleClose}
                    className="mt-8 w-full bg-primary text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 hover:bg-gray-800"
                >
                    Fermer
                </button>
            </div>
        ) : (
        <>
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
                <h2 className="text-lg font-serif font-semibold text-primary">Commande avec paiement à la livraison</h2>
                <button type="button" onClick={handleClose} className="text-secondary hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
                <div className="p-6 overflow-y-auto">
                    <div className="mb-6">
                        <h3 className="font-semibold text-primary mb-2">Mode de livraison</h3>
                        <div className="flex justify-between items-center border border-gray-300 rounded-md p-3 bg-gray-50">
                            <div className="flex items-center">
                                <input type="radio" id="delivery" name="delivery" defaultChecked className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                                <label htmlFor="delivery" className="ml-3 block text-sm font-medium text-primary">Paiement à la livraison</label>
                            </div>
                            <span className="text-sm font-semibold text-primary">{deliveryFee > 0 ? `${deliveryFee.toFixed(2)} dh` : 'Calculé à la prochaine étape'}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-primary">Insérez votre adresse de livraison</h3>
                        
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom Complet <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                </span>
                                <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                                </span>
                                <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Adresse <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                </span>
                                <input type="text" name="address" id="address" required value={formData.address} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Ville <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                </span>
                                <input 
                                    type="text" 
                                    name="city" 
                                    id="city" 
                                    list="city-options" 
                                    required 
                                    value={formData.city} 
                                    onChange={handleChange} 
                                    placeholder="Commencez à écrire votre ville..."
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" 
                                />
                                <datalist id="city-options">
                                    {cityList.map((city, index) => (
                                        <option key={index} value={city.charAt(0).toUpperCase() + city.slice(1)} />
                                    ))}
                                </datalist>
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                    
                    <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                        <div className="flex justify-between text-sm text-secondary"><span>Sous-total</span><span>{cartTotal.toFixed(2)} dh</span></div>
                        <div className="flex justify-between text-sm text-secondary"><span>Livraison</span><span>{deliveryFee > 0 ? `${deliveryFee.toFixed(2)} dh` : 'Gratuit / En attente'}</span></div>
                        <div className="flex justify-between text-base font-bold text-primary"><span>Total</span><span>{finalTotal.toFixed(2)} dh</span></div>
                    </div>
                </div>
                
                <div className="bg-gray-50 p-6 border-t border-gray-200 mt-auto">
                    {cartItems.length > 0 && cartItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between text-sm mb-4">
                            <div className="flex items-center">
                                <div className="relative">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded-md border border-gray-200"/>
                                    <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">{item.quantity}</span>
                                </div>
                                <p className="ml-3 font-semibold text-primary">{item.name}</p>
                            </div>
                            <p className="font-medium text-secondary">{(item.salePrice * item.quantity).toFixed(2)} dh</p>
                        </div>
                    ))}
                    <button type="submit" disabled={cartItems.length === 0} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {`Terminez votre achat - ${finalTotal.toFixed(2)} dh`}
                    </button>
                </div>
            </form>
        </>
        )}
    </Modal>
  );
};

export default CheckoutModal;