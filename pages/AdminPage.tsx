
import React, { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Product, Sale, Stats, PackItem } from '../types';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { 
  getProducts, 
  getSales, 
  addProductToDb, 
  updateProductInDb, 
  deleteProductFromDb, 
  addSaleToDb 
} from '../services/store';

// --- Icons (Modernized) ---
const LayoutIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const PackageIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const PlusIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const SearchIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const LayersIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const HistoryIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ShoppingCartIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const EditIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const TrashIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const DollarSignIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16V15" /></svg>;
const TrendingUpIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const BoxIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10l8 4 8-4V7l-8-4-8 4zm8-4v10m8-10l-8 4m0 0L4 7" /></svg>;
const XIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const AlertCircleIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const StatCard = ({ title, value, icon, color, trend, isPositive }: { title: string, value: string, icon: any, color: string, trend: string, isPositive: boolean }) => {
  const colorMap: any = {
    indigo: 'bg-indigo-600 shadow-indigo-200',
    emerald: 'bg-emerald-500 shadow-emerald-200',
    blue: 'bg-blue-500 shadow-blue-200',
    amber: 'bg-amber-500 shadow-amber-200',
  };
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-4 rounded-2xl text-white transition-transform group-hover:scale-110 ${colorMap[color] || 'bg-slate-900'}`}>{icon}</div>
        <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${isPositive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
          {trend}
        </div>
      </div>
      <div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.1em] mb-1">{title}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
};

const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'inventory' | 'sales' | 'packs'>('dashboard');
  
  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddPackOpen, setIsAddPackOpen] = useState(false);
  const [isSellOpen, setIsSellOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  // Selection
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [sellQty, setSellQty] = useState(1);
  const [packItems, setPackItems] = useState<PackItem[]>([]);
  const [packSearch, setPackSearch] = useState('');

  // Form Data
  const initialForm = { 
    name: '', 
    description: '', 
    image: '', 
    purchasePrice: 0, 
    salePrice: 0, 
    stock: 0, 
    isOrderBased: false,
    category: 'simple' as any 
  };
  const [formData, setFormData] = useState(initialForm);

  const navigate = useNavigate();

  // Load data initially when user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) navigate('/login');
      else {
        setUser(currentUser);
        loadData();
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // RELOAD DATA AUTOMATICALLY WHEN CHANGING TABS
  useEffect(() => {
    if (user) {
        loadData();
    }
  }, [currentTab, user]);

  const loadData = async () => {
    // We only show spinner on initial load to avoid UI flickers on tab change
    if (products.length === 0) setLoading(true);
    try {
      const [p, s] = await Promise.all([getProducts(), getSales()]);
      setProducts(p);
      setSales(s.sort((a,b) => b.date - a.date));
    } catch (e) {
      console.error("Failed to load admin data:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => signOut(auth).then(() => navigate('/login'));

  const stats: Stats = useMemo(() => {
    const revenue = sales.reduce((acc, s) => acc + (s.totalPrice || 0), 0);
    const profit = sales.reduce((acc, s) => acc + (s.profit || 0), 0);
    const totalSold = sales.reduce((acc, s) => acc + (s.quantity || 0), 0);
    const stockValue = products.reduce((acc, p) => acc + ((p.purchasePrice || 0) * (p.stock || 0)), 0);
    return { revenue, profit, totalSold, stockValue };
  }, [products, sales]);

  // Handlers
  const openAddModal = () => {
    setFormData(initialForm);
    setIsAddProductOpen(true);
  };

  const openPackModal = () => {
    setFormData({ ...initialForm, category: 'pack' });
    setPackItems([]);
    setPackSearch('');
    setIsAddPackOpen(true);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProductToDb({ ...formData, totalSold: 0 });
      setIsAddProductOpen(false);
      loadData();
    } catch (err: any) { alert("Erreur: " + err.message); }
  };

  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      const saleData = {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: sellQty,
        totalPrice: sellQty * Number(selectedProduct.salePrice),
        profit: sellQty * (Number(selectedProduct.salePrice) - Number(selectedProduct.purchasePrice || 0)),
        date: Date.now()
      };
      await addSaleToDb(saleData, selectedProduct.stock);
      setIsSellOpen(false);
      loadData();
    } catch (err: any) { alert(err.message); }
  };

  const handleAddPack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (packItems.length === 0) {
      alert("Veuillez sélectionner au moins un produit pour le pack.");
      return;
    }
    const cost = packItems.reduce((acc, i) => acc + (i.unitCost * i.quantity), 0);
    try {
      await addProductToDb({
        name: formData.name,
        description: formData.description,
        image: formData.image,
        purchasePrice: cost,
        salePrice: Number(formData.salePrice),
        category: 'pack',
        isOrderBased: formData.isOrderBased,
        packItems,
        stock: formData.isOrderBased ? 0 : Number(formData.stock),
        totalSold: 0
      });
      setIsAddPackOpen(false);
      loadData();
    } catch (err: any) { alert(err.message); }
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await deleteProductFromDb(productToDelete.id);
      setIsDeleteConfirmOpen(false);
      setProductToDelete(null);
      loadData();
    }
  };

  const packSummary = useMemo(() => {
    const cost = packItems.reduce((acc, i) => acc + (i.unitCost * i.quantity), 0);
    const profit = Number(formData.salePrice) - cost;
    return { cost, profit };
  }, [packItems, formData.salePrice]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Spinner /></div>;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden fixed inset-0 z-[100]">
      
      {/* Sidebar Modernized */}
      <aside className="hidden md:flex flex-col w-20 lg:w-72 bg-white border-r border-slate-200 transition-all shadow-[10px_0_40px_rgba(0,0,0,0.02)]">
        <div className="h-20 flex items-center px-8 border-b border-slate-100 shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">M</div>
          <span className="font-bold text-xl text-slate-800 ml-4 hidden lg:block tracking-tight">Mercadona Admin</span>
        </div>
        
        <div className="flex-1 py-8 px-4 space-y-1.5 overflow-y-auto">
          <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 hidden lg:block">Command Center</div>
          
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutIcon className="w-5 h-5" /> },
            { id: 'inventory', label: 'Inventaire', icon: <PackageIcon className="w-5 h-5" /> },
            { id: 'packs', label: 'Gestion Packs', icon: <LayersIcon className="w-5 h-5" /> },
            { id: 'sales', label: 'Historique Ventes', icon: <HistoryIcon className="w-5 h-5" /> },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setCurrentTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all group ${currentTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              <div className={`${currentTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'} transition-colors`}>{item.icon}</div>
              <span className="hidden lg:block">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all group">
            <XIcon className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span className="hidden lg:block font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Responsive Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 md:px-8 z-20 sticky top-0">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-black text-slate-800 tracking-tight capitalize">{currentTab}</h2>
             <span className="hidden sm:inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full uppercase border border-indigo-100">Enterprise</span>
          </div>
          
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="relative w-full max-w-sm hidden sm:block">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Rechercher (Ctrl+K)..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all outline-none" 
              />
            </div>
            
            <button 
              onClick={currentTab === 'packs' ? openPackModal : openAddModal} 
              className={`flex items-center gap-2 px-6 py-2.5 text-white text-sm font-bold rounded-2xl transition-all shadow-xl active:scale-95 shrink-0 ${currentTab === 'packs' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-900/10' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/10'}`}
            >
              <PlusIcon className="w-4 h-4" />
              <span className="hidden md:inline">
                {currentTab === 'packs' ? 'Ajouter Pack' : 'Ajouter Produit'}
              </span>
            </button>
          </div>
        </header>

        {/* Dynamic Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 pb-32">
          
          {/* Dashboard View */}
          {currentTab === 'dashboard' && (
            <div className="animate-fade-in space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Revenu Total" value={`${stats.revenue.toLocaleString()} DH`} icon={<DollarSignIcon className="w-6 h-6"/>} color="indigo" trend="+12.5%" isPositive={true}/>
                <StatCard title="Bénéfice Net" value={`${stats.profit.toLocaleString()} DH`} icon={<TrendingUpIcon className="w-6 h-6"/>} color="emerald" trend="+8.2%" isPositive={true} />
                <StatCard title="Ventes Totales" value={`${stats.totalSold}`} icon={<ShoppingCartIcon className="w-6 h-6"/>} color="blue" trend="+24 today" isPositive={true} />
                <StatCard title="Valeur Stock" value={`${stats.stockValue.toLocaleString()} DH`} icon={<BoxIcon className="w-6 h-6"/>} color="amber" trend="-2.4%" isPositive={false} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Ventes Récentes</h3>
                    <button onClick={() => setCurrentTab('sales')} className="text-indigo-600 text-sm font-bold hover:underline">Voir tout</button>
                  </div>
                  <div className="overflow-x-auto -mx-8 px-8">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                          <th className="pb-4">Produit</th>
                          <th className="pb-4">Date</th>
                          <th className="pb-4 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {sales.slice(0, 8).map(sale => (
                          <tr key={sale.id} className="group hover:bg-slate-50 transition-colors">
                            <td className="py-4">
                              <p className="font-bold text-slate-800 text-sm">{sale.productName}</p>
                              <p className="text-[10px] text-slate-400 font-medium">Quantité: {sale.quantity}</p>
                            </td>
                            <td className="py-4 text-sm text-slate-500">
                              {new Date(sale.date).toLocaleDateString()}
                            </td>
                            <td className="py-4 text-right">
                              <p className="font-black text-slate-800 text-sm">{sale.totalPrice.toFixed(2)} DH</p>
                              <p className="text-[10px] text-emerald-500 font-bold">+{sale.profit.toFixed(2)} profit</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Low Stock Indicator */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Alerte Stock</h3>
                  <div className="space-y-4 flex-1">
                    {products.filter(p => !p.isOrderBased && p.stock < 10).slice(0, 5).map(p => (
                      <div key={p.id} className="flex items-center gap-4 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                         <img src={p.image} className="w-10 h-10 rounded-xl object-contain bg-white shadow-sm" alt=""/>
                         <div className="flex-1 min-w-0">
                           <p className="text-sm font-bold text-slate-800 truncate">{p.name}</p>
                           <p className="text-[10px] font-bold text-rose-500">{p.stock} unités restantes</p>
                         </div>
                      </div>
                    ))}
                    {products.filter(p => !p.isOrderBased && p.stock < 10).length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                         <div className="p-4 bg-emerald-50 rounded-full text-emerald-500"><BoxIcon className="w-8 h-8"/></div>
                         <p className="text-sm font-medium">Stock optimisé !</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Inventory & Packs View */}
          {(currentTab === 'inventory' || currentTab === 'packs') && (
            <div className="animate-fade-in bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                  {currentTab === 'inventory' ? 'Inventaire des Produits' : 'Catalogue des Packs'}
                </h3>
                {currentTab === 'packs' && (
                  <span className="bg-amber-50 text-amber-600 text-[10px] font-black px-3 py-1 rounded-full border border-amber-100 uppercase tracking-widest">
                    Bundle Mode
                  </span>
                )}
              </div>
              <div className="p-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {products
                    .filter(p => currentTab === 'inventory' ? (p.category !== 'pack') : (p.category === 'pack'))
                    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
                    .map(product => (
                    <div key={product.id} className="group flex flex-col bg-white border border-slate-100 rounded-[2rem] p-3 hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 relative overflow-hidden">
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-3">
                         <img src={product.image} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-700" alt="" />
                         <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button onClick={() => { setSelectedProduct(product); setSellQty(1); setIsSellOpen(true); }} className="p-3 bg-white text-emerald-600 rounded-full hover:scale-110 transition-transform shadow-xl"><ShoppingCartIcon className="w-5 h-5"/></button>
                            <button onClick={() => { setSelectedProduct(product); setIsEditOpen(true); setFormData({...product} as any); }} className="p-3 bg-white text-amber-500 rounded-full hover:scale-110 transition-transform shadow-xl"><EditIcon className="w-5 h-5"/></button>
                            <button onClick={() => { setProductToDelete(product); setIsDeleteConfirmOpen(true); }} className="p-3 bg-white text-rose-500 rounded-full hover:scale-110 transition-transform shadow-xl"><TrashIcon className="w-5 h-5"/></button>
                         </div>
                         {product.isOrderBased && <span className="absolute top-3 right-3 bg-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase shadow-lg">Sur Commande</span>}
                         {product.stock < 5 && !product.isOrderBased && <span className="absolute top-3 left-3 bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase animate-pulse">Low Stock</span>}
                      </div>
                      <div className="flex-1 flex flex-col px-1">
                         <h4 className="font-bold text-slate-800 text-xs leading-tight mb-2 line-clamp-2">{product.name}</h4>
                         <div className="mt-auto flex items-end justify-between">
                            <div><div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Prix Vente</div><div className="font-black text-indigo-600 text-sm">{(product.salePrice || 0).toFixed(2)} <span className="text-[10px]">DH</span></div></div>
                            <div className={`text-[10px] font-black px-2 py-1 rounded-xl shadow-sm ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                               {product.isOrderBased ? '∞' : product.stock}
                            </div>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sales View */}
          {currentTab === 'sales' && (
            <div className="animate-fade-in bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
               <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-800">Historique des Ventes</h3>
                  <button onClick={loadData} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><HistoryIcon className="w-5 h-5"/></button>
               </div>
               <div className="p-0 overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <th className="px-8 py-4">Produit</th>
                        <th className="px-8 py-4">Date</th>
                        <th className="px-8 py-4">Quantité</th>
                        <th className="px-8 py-4">Total</th>
                        <th className="px-8 py-4">Bénéfice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {sales.map(sale => (
                        <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-5">
                            <span className="font-bold text-slate-800 text-sm">{sale.productName}</span>
                          </td>
                          <td className="px-8 py-5 text-sm text-slate-500">
                            {new Date(sale.date).toLocaleString()}
                          </td>
                          <td className="px-8 py-5">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">{sale.quantity}</span>
                          </td>
                          <td className="px-8 py-5 font-black text-slate-800 text-sm">
                            {sale.totalPrice.toFixed(2)} DH
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-emerald-600 font-bold text-sm">+{sale.profit.toFixed(2)} DH</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* --- Floating Bottom Nav (Mobile Only) --- */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-6 py-4 rounded-3xl flex items-center gap-8 shadow-2xl border border-white/10 z-[300]">
          <button onClick={() => setCurrentTab('dashboard')} className={currentTab === 'dashboard' ? 'text-indigo-400' : 'text-white/60'}><LayoutIcon className="w-6 h-6"/></button>
          <button onClick={() => setCurrentTab('inventory')} className={currentTab === 'inventory' ? 'text-indigo-400' : 'text-white/60'}><PackageIcon className="w-6 h-6"/></button>
          <button onClick={() => setCurrentTab('packs')} className={currentTab === 'packs' ? 'text-indigo-400' : 'text-white/60'}><LayersIcon className="w-6 h-6"/></button>
          <button onClick={() => setCurrentTab('sales')} className={currentTab === 'sales' ? 'text-indigo-400' : 'text-white/60'}><HistoryIcon className="w-6 h-6"/></button>
          <button onClick={handleLogout} className="text-rose-400"><XIcon className="w-6 h-6"/></button>
      </div>

      {/* --- Modals --- */}
      
      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && productToDelete && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-10 animate-fade-in-scale text-center">
             <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-100">
                <AlertCircleIcon className="w-10 h-10" />
             </div>
             <h2 className="text-2xl font-black text-slate-800 mb-2">Êtes-vous sûr ?</h2>
             <p className="text-slate-500 text-sm mb-10 leading-relaxed">
               Vous êtes sur le point de supprimer <span className="font-bold text-slate-800">"{productToDelete.name}"</span>. Cette action est irréversible.
             </p>
             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
                >
                  Annuler
                </button>
                <button 
                  onClick={confirmDelete}
                  className="py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 active:scale-95"
                >
                  Supprimer
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {isSellOpen && selectedProduct && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-8 animate-fade-in-scale">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black tracking-tight">Caisse</h2>
                <button onClick={() => setIsSellOpen(false)} className="p-3 hover:bg-slate-100 rounded-full transition-colors"><XIcon className="w-6 h-6"/></button>
            </div>
            <div className="flex items-center gap-5 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 mb-8">
                <img src={selectedProduct.image} className="w-20 h-20 rounded-2xl object-contain bg-white shadow-md border border-slate-100" alt=""/>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-tight mb-1">{selectedProduct.name}</h3>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Stock: {selectedProduct.isOrderBased ? 'ILLIMITÉ' : selectedProduct.stock}</p>
                </div>
            </div>
            <div className="space-y-4 mb-10">
              <label className="text-center block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quantité à vendre</label>
              <div className="flex items-center justify-center gap-10">
                  <button onClick={() => setSellQty(Math.max(1, sellQty-1))} className="w-14 h-14 rounded-full border-2 border-slate-100 flex items-center justify-center text-2xl font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all">-</button>
                  <span className="text-5xl font-black text-slate-900 tabular-nums">{sellQty}</span>
                  <button onClick={() => setSellQty(selectedProduct.isOrderBased ? sellQty + 1 : Math.min(selectedProduct.stock, sellQty+1))} className="w-14 h-14 rounded-full border-2 border-slate-100 flex items-center justify-center text-2xl font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all">+</button>
              </div>
            </div>
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex justify-between items-center mb-6 shadow-2xl shadow-slate-900/20">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total à encaisser</span>
                  <p className="text-white/40 text-[10px]">{selectedProduct.salePrice.toFixed(2)} DH / unité</p>
                </div>
                <span className="text-4xl font-black tracking-tighter">{(selectedProduct.salePrice * sellQty).toFixed(2)} <span className="text-xl font-normal text-slate-400">DH</span></span>
            </div>
            <button onClick={handleSell} className="w-full py-5 bg-emerald-500 text-white rounded-3xl font-black text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-200 active:scale-95">Confirmer l'encaissement</button>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {(isAddProductOpen || isEditOpen) && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
           <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl p-10 max-h-[95vh] overflow-y-auto animate-fade-in-scale scrollbar-hide">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black tracking-tight">{isEditOpen ? 'Mise à jour' : 'Nouveau Produit'}</h2>
                <button onClick={() => { setIsAddProductOpen(false); setIsEditOpen(false); }} className="p-3 hover:bg-slate-100 rounded-full transition-colors"><XIcon className="w-6 h-6"/></button>
             </div>
             <form onSubmit={isEditOpen ? (e) => { e.preventDefault(); updateProductInDb(selectedProduct!.id, formData).then(() => { setIsEditOpen(false); loadData(); }); } : handleAddProduct} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Désignation</label>
                  <input type="text" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nom du produit..." />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Prix d'Achat (DH)</label>
                    <input type="number" step="0.01" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-bold" value={formData.purchasePrice} onChange={e => setFormData({...formData, purchasePrice: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Prix de Vente (DH)</label>
                    <input type="number" step="0.01" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-bold text-indigo-600" value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: Number(e.target.value)})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Stock Actuel</label>
                    <input type="number" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-bold disabled:opacity-30" disabled={formData.isOrderBased} value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">URL Image</label>
                    <input type="text" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 text-sm" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." />
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 transition-all hover:bg-indigo-50">
                    <input type="checkbox" id="isOrderBased" className="w-6 h-6 rounded-lg text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600" checked={formData.isOrderBased} onChange={e => setFormData({...formData, isOrderBased: e.target.checked})} />
                    <label htmlFor="isOrderBased" className="text-sm font-bold text-indigo-900 cursor-pointer select-none">Produit "Sur Commande" <span className="text-[10px] font-medium opacity-60 block mt-0.5">Le stock sera marqué comme illimité</span></label>
                </div>
                {/* ADDED DESCRIPTION FIELD FOR INDIVIDUAL PRODUCTS */}
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Description</label>
                    <textarea 
                        rows={3} 
                        placeholder="Description du produit..." 
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 text-sm resize-none font-medium" 
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})} 
                    />
                </div>
                <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-lg hover:bg-slate-800 transition-all mt-6 shadow-2xl shadow-slate-900/20 active:scale-95">
                  {isEditOpen ? 'Enregistrer les modifications' : 'Ajouter à l\'inventaire'}
                </button>
             </form>
           </div>
        </div>
      )}

      {/* Add Pack Modal REFINED */}
      {isAddPackOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
           <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl p-8 max-h-[95vh] overflow-y-auto animate-fade-in-scale scrollbar-hide">
             <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Création de Pack</h2>
                <button onClick={() => setIsAddPackOpen(false)} className="text-slate-400 hover:text-slate-600"><XIcon className="w-5 h-5"/></button>
             </div>

             <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-100 mb-8 flex gap-4 items-center">
                <div className="p-2.5 bg-white rounded-xl shadow-sm text-amber-500 border border-amber-100/50">
                    <LayersIcon className="w-6 h-6"/>
                </div>
                <p className="text-xs text-amber-900/80 font-bold leading-relaxed">
                  Regroupez vos produits pour créer des offres attractives et booster vos ventes moyennes.
                </p>
             </div>
             
             <form onSubmit={handleAddPack} className="space-y-6">
                {/* NOM DE L'OFFRE */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">NOM DE L'OFFRE</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ex: Pack Hiver Complet" 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-100 font-medium" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                  />
                </div>

                {/* SÉLECTIONNER DES PRODUITS */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">SÉLECTIONNER DES PRODUITS</label>
                    <div className="bg-white border rounded-2xl p-4 space-y-3 shadow-sm min-h-[140px] ring-1 ring-slate-100">
                        <div className="relative mb-3">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Tapez pour chercher..." 
                                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border-none rounded-xl outline-none ring-1 ring-slate-200 focus:ring-amber-200 transition-all" 
                                value={packSearch} 
                                onChange={e => setPackSearch(e.target.value)}
                            />
                            
                            {/* Search Results Dropdown */}
                            {packSearch && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-2xl shadow-2xl z-20 max-h-60 overflow-y-auto p-1.5 divide-y divide-slate-50 animate-fade-in">
                                    {products
                                      .filter(p => p.name.toLowerCase().includes(packSearch.toLowerCase()) && p.category !== 'pack')
                                      .map(p => (
                                        <button 
                                          key={p.id} 
                                          type="button" 
                                          onClick={() => { 
                                            if (!packItems.find(i => i.productId === p.id)) {
                                              setPackItems([...packItems, { productId: p.id, productName: p.name, quantity: 1, unitCost: p.purchasePrice }]);
                                            }
                                            setPackSearch(''); 
                                          }} 
                                          className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 text-left transition-all group rounded-xl"
                                        >
                                            <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                                <img src={p.image} className="w-full h-full object-contain" alt=""/>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-slate-800 truncate">{p.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold">{p.purchasePrice.toFixed(2)} DH</p>
                                            </div>
                                            <div className="p-1.5 bg-slate-100 rounded-full text-slate-300 group-hover:bg-amber-500 group-hover:text-white transition-all">
                                                <PlusIcon className="w-3.5 h-3.5" />
                                            </div>
                                        </button>
                                    ))}
                                    {products.filter(p => p.name.toLowerCase().includes(packSearch.toLowerCase()) && p.category !== 'pack').length === 0 && (
                                        <div className="p-4 text-center text-[10px] text-slate-400 font-bold uppercase">Aucun résultat</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                            {packItems.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100/50 group hover:border-amber-200 transition-colors">
                                    <div className="w-8 h-8 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                        <img src={products.find(p => p.id === item.productId)?.image} className="w-full h-full object-contain" alt=""/>
                                    </div>
                                    <span className="flex-1 text-xs font-bold text-slate-700 truncate">{item.productName}</span>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="number" 
                                            min="1" 
                                            className="w-12 text-center text-xs font-black bg-white border border-slate-200 rounded-lg py-1 outline-none focus:ring-1 focus:ring-amber-200" 
                                            value={item.quantity} 
                                            onChange={e => { const newItems = [...packItems]; newItems[idx].quantity = Math.max(1, Number(e.target.value)); setPackItems(newItems); }} 
                                        />
                                        <button type="button" onClick={() => setPackItems(packItems.filter((_, i) => i !== idx))} className="text-slate-300 hover:text-rose-500 transition-colors"><TrashIcon className="w-4 h-4"/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* STOCK INITIAL */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">STOCK INITIAL</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-100 font-medium disabled:opacity-50" 
                    disabled={formData.isOrderBased} 
                    value={formData.stock} 
                    onChange={e => setFormData({...formData, stock: Number(e.target.value)})} 
                  />
                </div>

                {/* Sur commande */}
                <div className="flex items-center gap-3 bg-purple-50/30 p-4 rounded-2xl border border-purple-100/50 hover:bg-purple-50/50 transition-colors">
                    <input 
                        type="checkbox" 
                        id="pack-sur-commande" 
                        className="w-5 h-5 rounded-md text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600" 
                        checked={formData.isOrderBased} 
                        onChange={e => setFormData({...formData, isOrderBased: e.target.checked})} 
                    />
                    <label htmlFor="pack-sur-commande" className="text-sm font-black text-purple-700 cursor-pointer select-none">Sur commande</label>
                </div>

                {/* Calculation Summary Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 grid grid-cols-2 gap-x-8 gap-y-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">COÛT DE REVIENT</label>
                        <p className="text-xl font-black text-slate-800">{packSummary.cost.toFixed(2)} DH</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">PRIX VENTE PACK</label>
                        <div className="flex items-center justify-end gap-2">
                            <input 
                                type="number" 
                                step="0.01" 
                                className="w-24 text-right bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-black text-amber-500 outline-none focus:ring-2 focus:ring-amber-200" 
                                value={formData.salePrice} 
                                onChange={e => setFormData({...formData, salePrice: Number(e.target.value)})} 
                            />
                            <span className="text-[10px] font-black text-amber-600">DH</span>
                        </div>
                        <p className={`text-[10px] font-black ${packSummary.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>Marge: {packSummary.profit.toFixed(2)} DH</p>
                    </div>
                </div>

                {/* IMAGE & DESCRIPTION */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">IMAGE & DESCRIPTION</h3>
                    <input 
                        type="text" 
                        placeholder="URL Image" 
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-100 text-sm" 
                        value={formData.image} 
                        onChange={e => setFormData({...formData, image: e.target.value})} 
                    />
                    <textarea 
                        rows={3} 
                        placeholder="Description marketing..." 
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-100 text-sm resize-none" 
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})} 
                    />
                </div>
                
                <button 
                  type="submit" 
                  disabled={packItems.length === 0} 
                  className="w-full py-5 bg-amber-400 text-white rounded-[1.5rem] font-black text-lg hover:bg-amber-500 transition-all shadow-xl shadow-amber-900/10 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Lancer le Pack
                </button>
             </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
