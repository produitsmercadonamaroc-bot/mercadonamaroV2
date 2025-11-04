import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import Spinner from '../components/Spinner';

interface OrderWithId extends Omit<Order, 'createdAt'> {
    id: string;
    createdAt: string; // Changed from Timestamp to string
}


const AdminPage: React.FC = () => {
    const [orders, setOrders] = useState<OrderWithId[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                // Simulate async fetch from localStorage
                setTimeout(() => {
                    const storedOrders = localStorage.getItem('orders');
                    if (storedOrders) {
                        const parsedOrders: OrderWithId[] = JSON.parse(storedOrders);
                        // Sort by date descending
                        parsedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                        setOrders(parsedOrders);
                    }
                    setLoading(false);
                }, 500);
            } catch (err: any) {
                setError('Erreur de chargement des commandes: ' + err.message);
                console.error(err);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    const formatTimestamp = (isoString: string) => {
        if (!isoString) return 'Date non disponible';
        return new Date(isoString).toLocaleString('fr-FR');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-serif font-bold mb-8 text-center text-primary">Administration - Commandes</h1>
            
            {orders.length === 0 ? (
                <p className="text-center text-secondary">Aucune commande n'a été passée pour le moment.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg shadow-sm p-6 bg-green-100 border-green-300 text-green-900 text-center">
                            <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4">
                                <div className="mb-4 sm:mb-0">
                                    <h2 className="text-lg font-bold">Commande #{order.id.substring(0, 8)}</h2>
                                    <p className="text-sm text-green-700">
                                        {formatTimestamp(order.createdAt)}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold">{order.total.toFixed(2)} DH</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div>
                                    <h3 className="font-semibold mb-2 border-b pb-1 border-green-300">Informations Client</h3>
                                    <p><strong>Nom:</strong> {order.name}</p>
                                    <p><strong>Téléphone:</strong> {order.phone}</p>
                                    <p><strong>Adresse:</strong> {order.address}</p>
                                    <p><strong>Ville:</strong> {order.city}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2 border-b pb-1 border-green-300">Produits</h3>
                                    <div className="space-y-1">
                                        {order.items.map((item, itemIndex) => (
                                            <p key={`${item.id}-${itemIndex}`} className="text-sm">
                                                {item.name} - <strong>x{item.quantity}</strong> ({item.price.toFixed(2)} dh)
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPage;