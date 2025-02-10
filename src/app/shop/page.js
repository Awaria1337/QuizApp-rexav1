"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiDollarSign, FiShoppingCart, FiPackage } from 'react-icons/fi';

export default function ShopPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);

    useEffect(() => {
        fetchShopItems();
    }, []);

    const fetchShopItems = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/shop');
            if (!response.ok) {
                throw new Error('Ürünler yüklenirken bir hata oluştu');
            }
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Error fetching shop items:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (item) => {
        setCart([...cart, item]);
        // Ses efekti yerine console.log kullanıyoruz
        console.log('Ürün sepete eklendi:', item.name);
    };

    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => item._id !== itemId));
    };

    const checkout = () => {
        // Ödeme işlemi
        setCart([]);
        setShowCart(false);
        // Ses efekti yerine console.log kullanıyoruz
        console.log('Ödeme başarılı');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#58CC02]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Mağaza</h1>
                        <p className="text-gray-600 mt-2">Özel ürünler ve bonuslar</p>
                    </div>
                    <button
                        onClick={() => setShowCart(true)}
                        className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#58CC02] hover:bg-[#4CAF00]"
                    >
                        <FiShoppingCart className="w-5 h-5 mr-2" />
                        Sepet
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                {cart.length}
                            </span>
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <div className={`p-3 rounded-lg bg-${item.type === 'heart' ? 'red' : 'blue'}-100`}>
                                        {item.type === 'heart' ? (
                                            <FiHeart className="w-6 h-6 text-red-500" />
                                        ) : (
                                            <FiDollarSign className="w-6 h-6 text-blue-500" />
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-500">{item.description}</p>
                                    </div>
                                </div>
                                <span className="flex items-center text-[#58CC02] font-medium">
                                    <FiDollarSign className="w-4 h-4 mr-1" />
                                    {item.price.amount}
                                </span>
                            </div>
                            <button
                                onClick={() => addToCart(item)}
                                className="w-full bg-[#58CC02] text-white py-2 rounded-lg font-medium hover:bg-[#4CAF00] transition-colors"
                            >
                                Sepete Ekle
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Sepet Modal */}
                {showCart && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Sepetim</h2>
                                <button
                                    onClick={() => setShowCart(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            {cart.length === 0 ? (
                                <div className="text-center py-8">
                                    <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">Sepetiniz boş</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4 mb-6">
                                        {cart.map((item) => (
                                            <div
                                                key={item._id}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex items-center">
                                                    <div className={`p-2 rounded-lg bg-${item.type === 'heart' ? 'red' : 'blue'}-100`}>
                                                        {item.type === 'heart' ? (
                                                            <FiHeart className="w-4 h-4 text-red-500" />
                                                        ) : (
                                                            <FiDollarSign className="w-4 h-4 text-blue-500" />
                                                        )}
                                                    </div>
                                                    <div className="ml-3">
                                                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                                                        <p className="text-sm text-gray-500">{item.price.amount} taş</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item._id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Kaldır
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between mb-4">
                                            <span className="font-medium">Toplam</span>
                                            <span className="font-bold text-[#58CC02]">
                                                {cart.reduce((total, item) => total + item.price.amount, 0)} taş
                                            </span>
                                        </div>
                                        <button
                                            onClick={checkout}
                                            className="w-full bg-[#58CC02] text-white py-3 rounded-xl font-medium hover:bg-[#4CAF00]"
                                        >
                                            Satın Al
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}