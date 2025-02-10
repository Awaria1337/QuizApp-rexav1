'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiEdit2, FiMail, FiLock, FiPieChart, FiAward, FiHeart } from 'react-icons/fi';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [stats, setStats] = useState({
        totalQuizzes: 45,
        correctAnswers: 178,
        wrongAnswers: 22,
        categoryStats: {
            'Matematik': 25,
            'Fen Bilgisi': 15,
            'Tarih': 5
        }
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/auth/login');
            return;
        }
        setUser(JSON.parse(storedUser));
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        // Profil güncelleme işlemleri burada yapılacak
        setIsEditing(false);
    };

    const handleResetPassword = async () => {
        // Şifre sıfırlama işlemleri burada yapılacak
        alert('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
    };

    if (!user) {
        return <div>Yükleniyor...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sol Taraf - Profil Bilgileri */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <div className="text-center mb-6">
                                <div className="relative inline-block">
                                    <img
                                        src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
                                        alt="Profil"
                                        className="w-32 h-32 rounded-full mx-auto"
                                    />
                                    {isEditing && (
                                        <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full">
                                            <FiEdit2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <h2 className="mt-4 text-xl font-bold">{user.username}</h2>
                                <p className="text-gray-500">{user.email}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Üyelik Tarihi</span>
                                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Streak</span>
                                    <span className="font-bold text-[#58CC02]">{user.streak || 0} gün</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Kalpler</span>
                                    <span className="flex items-center">
                                        <FiHeart className="text-red-500 mr-1" />
                                        {user.hearts || 5}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <FiEdit2 className="mr-2" />
                                    Profili Düzenle
                                </button>
                                <button
                                    onClick={handleResetPassword}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <FiLock className="mr-2" />
                                    Şifre Sıfırla
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sağ Taraf - İstatistikler ve Başarılar */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* İstatistikler */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <h3 className="text-lg font-semibold mb-4">Quiz İstatistikleri</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Toplam Quiz</div>
                                    <div className="text-2xl font-bold text-[#58CC02]">{stats.totalQuizzes}</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Doğru Cevap</div>
                                    <div className="text-2xl font-bold text-green-500">{stats.correctAnswers}</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Yanlış Cevap</div>
                                    <div className="text-2xl font-bold text-red-500">{stats.wrongAnswers}</div>
                                </div>
                            </div>

                            <h4 className="text-md font-semibold mb-3">Kategori Bazlı İstatistikler</h4>
                            <div className="space-y-3">
                                {Object.entries(stats.categoryStats).map(([category, count]) => (
                                    <div key={category} className="flex items-center justify-between">
                                        <span className="text-gray-600">{category}</span>
                                        <span className="font-medium">{count} quiz</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Başarılar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <h3 className="text-lg font-semibold mb-4">Başarılar</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                    <FiAward className="w-8 h-8 text-yellow-500 mr-3" />
                                    <div>
                                        <div className="font-medium">Quiz Ustası</div>
                                        <div className="text-sm text-gray-500">100 quiz tamamlandı</div>
                                    </div>
                                </div>
                                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                    <FiPieChart className="w-8 h-8 text-blue-500 mr-3" />
                                    <div>
                                        <div className="font-medium">Mükemmel Skor</div>
                                        <div className="text-sm text-gray-500">10 quiz %100 başarı</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}   