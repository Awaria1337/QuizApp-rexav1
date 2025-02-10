"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiHeart, FiAward, FiCheck, FiLock } from 'react-icons/fi';

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {   
            const response = await fetch('/api/admin/tasks');
            if (!response.ok) {
                throw new Error('Görevler yüklenirken bir hata oluştu');
            }
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
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
                <div className="mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Günlük Görevler</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.filter(task => task.type === 'daily').map((task) => (
                            <motion.div
                                key={task._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <FiStar className="w-6 h-6 text-[#58CC02] mr-3" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{task.title}</h3>
                                            <p className="text-sm text-gray-500">{task.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-[#58CC02]">
                                        {task.reward.xp} XP
                                        {task.reward.gems > 0 && ` + ${task.reward.gems} Taş`}
                                        {task.reward.hearts > 0 && ` + ${task.reward.hearts} Can`}
                                    </div>
                                </div>
                                <div className="relative pt-1">
                                    <div className="flex mb-2 items-center justify-between">
                                        <div>
                                            <span className="text-xs font-semibold inline-block text-[#58CC02]">
                                                0%
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-semibold inline-block text-[#58CC02]">
                                                0/{task.requirement.count}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-100">
                                        <div
                                            style={{ width: '0%' }}
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#58CC02]"
                                        ></div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Başarılar</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.filter(task => task.type === 'achievement').map((task) => (
                            <motion.div
                                key={task._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <FiAward className="w-6 h-6 text-[#58CC02] mr-3" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{task.title}</h3>
                                            <p className="text-sm text-gray-500">{task.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-[#58CC02]">
                                        {task.reward.xp} XP
                                        {task.reward.gems > 0 && ` + ${task.reward.gems} Taş`}
                                        {task.reward.hearts > 0 && ` + ${task.reward.hearts} Can`}
                                    </div>
                                </div>
                                <div className="relative pt-1">
                                    <div className="flex mb-2 items-center justify-between">
                                        <div>
                                            <span className="text-xs font-semibold inline-block text-[#58CC02]">
                                                0%
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-semibold inline-block text-[#58CC02]">
                                                0/{task.requirement.count}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-100">
                                        <div
                                            style={{ width: '0%' }}
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#58CC02]"
                                        ></div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}