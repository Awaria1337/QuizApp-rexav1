'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiHome, FiBook, FiAward, FiShoppingBag, FiUser, FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Initial check for user data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }

        // Listen for login event
        const handleLogin = () => {
            const updatedUser = localStorage.getItem('user');
            if (updatedUser) {
                try {
                    setUser(JSON.parse(updatedUser));
                } catch (error) {
                    console.error('Error parsing user data:', error);
                }
            }
        };

        window.addEventListener('userLogin', handleLogin);
        return () => window.removeEventListener('userLogin', handleLogin);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        router.push('/auth/login');
    };

    return (
        <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-4">
            <div className="flex flex-col h-full">
                <div className="mb-8">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold">Quiz App</span>
                    </Link>
                </div>

                <nav className="flex-1">
                    <ul className="space-y-2">
                        <li>
                            <Link href="/" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                                <FiHome className="w-5 h-5" />
                                <span>Ana Sayfa</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/tasks" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                                <FiBook className="w-5 h-5" />
                                <span>Görevler</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/leaderboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                                <FiAward className="w-5 h-5" />
                                <span>Puan Tablosu</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/shop" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                                <FiShoppingBag className="w-5 h-5" />
                                <span>Mağaza</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="border-t pt-4">
                    {user ? (
                        <div className="space-y-2">
                            <Link href="/profile" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                                <FiUser className="w-5 h-5" />
                                <span>Profilim</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-red-600 w-full"
                            >
                                <FiLogOut className="w-5 h-5" />
                                <span>Çıkış Yap</span>
                            </button>
                        </div>
                    ) : (
                        <Link href="/auth/login" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                            <FiUser className="w-5 h-5" />
                            <span>Giriş Yap</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}