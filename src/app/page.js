"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiStar, FiHeart, FiAward } from "react-icons/fi";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (categoryId) => {
    router.push(`/quiz?category=${categoryId}&count=5`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hoş Geldiniz!</h1>
        <p className="text-gray-600">Öğrenmeye başlamak için bir kategori seçin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-500">{category.description}</p>
              </div>
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-5 h-5 ${i < 2 ? "text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={() => handleStartQuiz(category._id)}
              className="w-full bg-[#58CC02] text-white py-3 rounded-xl font-medium hover:bg-[#4CAF00] transition-colors"
            >
              Başla
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <FiHeart className="w-8 h-8 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Günlük Hedefler</h3>
          <p className="text-gray-500">Her gün yeni hedeflerle kendini geliştir</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <FiAward className="w-8 h-8 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Başarılar</h3>
          <p className="text-gray-500">Özel başarılar kazanın ve seviye atlayın</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <FiStar className="w-8 h-8 text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Liderlik Tablosu</h3>
          <p className="text-gray-500">En iyi oyuncular arasında yerinizi alın</p>
        </motion.div>
      </div>
    </div>
  );
}