"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiTrendingUp, FiUsers } from 'react-icons/fi';

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [stats, setStats] = useState({
        totalPlayers: 0,
        highestStreak: 0,
        weeklyXP: 0
    });
    const [timeFilter, setTimeFilter] = useState('weekly');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLeaderboard();
    }, [timeFilter]);

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch('/api/leaderboard');
            if (!response.ok) {
                throw new Error('Puan tablosu yüklenirken bir hata oluştu');
            }
            const data = await response.json();
            setLeaderboard(data.users || []);
            setStats(data.stats || {
                totalPlayers: 0,
                highestStreak: 0,
                weeklyXP: 0
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getRankColor = (rank) => {
        switch (rank) {
            case 1: return 'text-yellow-500';
            case 2: return 'text-gray-400';
            case 3: return 'text-amber-600';
            default: return 'text-gray-700';
        }
    };

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return '👑';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return rank;
        }
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
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Puan Tablosu</h1>
                    <p className="text-gray-600">En iyi oyuncular ve başarıları</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex flex-wrap gap-4 mb-6">
                        <select
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#58CC02] focus:border-[#58CC02]"
                        >
                            <option value="daily">Günlük</option>
                            <option value="weekly">Haftalık</option>
                            <option value="monthly">Aylık</option>
                            <option value="allTime">Tüm Zamanlar</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sıra</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seviye</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">XP</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Streak</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {leaderboard.map((user, index) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ scale: 1.01 }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-lg font-bold ${getRankColor(index + 1)}`}>
                                                {getRankIcon(index + 1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img 
                                                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
                                                    alt={user.username}
                                                    className="h-10 w-10 rounded-full"
                                                />
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.username}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">Level {user.level || 1}</div>
                                            <div className="w-24 bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-[#58CC02] h-2 rounded-full" 
                                                    style={{ 
                                                        width: `${((user.xp || 0) / ((user.level || 1) * 1000)) * 100}%` 
                                                    }}
                                                ></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-[#58CC02]">
                                                {user.xp || 0} XP
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FiTrendingUp className="w-4 h-4 text-[#58CC02] mr-1" />
                                                <span className="text-sm text-gray-900">{user.streak || 0} gün</span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* İstatistikler */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl shadow-sm p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Toplam Oyuncu</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalPlayers}</p>
                            </div>
                            <FiUsers className="w-8 h-8 text-[#58CC02]" />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl shadow-sm p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">En Yüksek Streak</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.highestStreak || 0} gün</p>
                            </div>
                            <FiAward className="w-8 h-8 text-[#58CC02]" />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl shadow-sm p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Haftalık XP</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.weeklyXP || 0}</p>
                            </div>
                            <FiTrendingUp className="w-8 h-8 text-[#58CC02]" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}