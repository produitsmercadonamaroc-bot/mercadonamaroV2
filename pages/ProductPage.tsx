import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Product } from '../types';
import Spinner from '../components/Spinner';
import { useCart } from '../hooks/useCart';
import { useUI } from '../hooks/useUI';
import RelatedProducts from '../components/RelatedProducts';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { openCart, openCheckout } = useUI();

  useEffect(() => {
    setLoading(true);
    setQuantity(1); // Reset quantity when product changes
    const fetchProduct = async () => {
      if (!id) {
        setError("ID de produit manquant.");
        setLoading(false);
        return;
      }
      try {
        const productDocRef = doc(db, 'products', id);
        const productSnap = await getDoc(productDocRef);

        if (productSnap.exists()) {
          setProduct({ id: productSnap.id, ...productSnap.data() } as Product);
        } else {
          setError('Produit non trouvé.');
        }
      } catch (err: any) {
        setError('Erreur de chargement du produit: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      openCheckout();
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      openCart();
    }
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = `https://picsum.photos/seed/${id}/600/600`;
  };
  
  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };


  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!product) return <p className="text-center text-secondary">Produit introuvable.</p>;

  return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            <div className="bg-accent rounded-lg p-4 flex justify-center items-center aspect-square sticky top-28">
                <img 
                    src={product.image || `https://picsum.photos/seed/${id}/600/600`}
                    alt={product.name} 
                    onError={handleImageError}
                    className="w-full max-w-md h-auto object-contain"
                />
            </div>
            <div className="flex flex-col space-y-6 pt-4">
                <p className="text-sm font-semibold tracking-widest text-secondary uppercase">PRODUITS MERCADONA MAROC</p>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary capitalize">{product.name}</h1>
                <p className="text-3xl font-semibold text-primary">{product.salePrice.toFixed(2)} DH</p>
                
                <p className="text-secondary leading-relaxed text-sm">
                  {product.description || 'Frais d\\\'expédition calculés à l\\\'étape de paiement.'}
                </p>

                <div className="flex items-center space-x-4">
                    <label htmlFor="quantity" className="font-semibold text-sm">Quantité</label>
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <button onClick={() => handleQuantityChange(-1)} className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors" aria-label="Decrease quantity">-</button>
                        <span className="px-4 text-base w-12 text-center" id="quantity">{quantity}</span>
                        <button onClick={() => handleQuantityChange(1)} className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors" aria-label="Increase quantity">+</button>
                    </div>
                </div>

                <div className="flex flex-col space-y-4 pt-4">
                    <button onClick={handleAddToCart} className="w-full border border-primary text-primary font-bold py-3 px-6 rounded-md transition-colors duration-300 hover:bg-primary hover:text-white">
                        Ajouter au panier
                    </button>
                    <button onClick={handleBuyNow} className="w-full bg-primary text-white font-bold py-3 px-6 rounded-md transition-colors duration-300 hover:bg-gray-800">
                        Acheter maintenant
                    </button>
                </div>
            </div>
        </div>
        
        {id && <RelatedProducts currentProductId={id} />}
    </div>
  );
};

export default ProductPage;