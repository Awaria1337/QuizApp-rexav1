'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import AdminNav from '@/components/AdminNav';

const AddQuestionPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [question, setQuestion] = useState({
    category: '',
    difficulty: 'Orta',
    question: '',
    options: ['', '', '', '', ''],
    correctAnswer: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuth');
    if (!isAuth) {
      router.push('/admin');
      return;
    }
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Kategoriler yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setCategories(data);
      if (data.length > 0) {
        setQuestion(prev => ({ ...prev, category: data[0]._id }));
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!question.category || !question.question || question.options.some(opt => !opt.trim())) {
        throw new Error('Lütfen tüm alanları doldurun');
      }

      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(question),
      });

      if (!response.ok) {
        throw new Error('Soru eklenirken bir hata oluştu');
      }

      setSuccessMessage('Soru başarıyla eklendi');
      setTimeout(() => {
        router.push('/admin/questions');
      }, 1500);
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminNav title="Quiz Admin">
        <button
          onClick={() => router.push('/admin/questions')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-slate-600 hover:bg-slate-50"
        >
          <FiArrowLeft className="mr-2" />
          Geri Dön
        </button>
      </AdminNav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Error and Success Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Question Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleQuestionSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Kategori
                </label>
                <select
                  value={question.category}
                  onChange={(e) => setQuestion({ ...question, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Zorluk
                </label>
                <select
                  value={question.difficulty}
                  onChange={(e) => setQuestion({ ...question, difficulty: e.target.value })}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="Kolay">Kolay</option>
                  <option value="Orta">Orta</option>
                  <option value="Zor">Zor</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Soru
              </label>
              <textarea
                value={question.question}
                onChange={(e) => setQuestion({ ...question, question: e.target.value })}
                rows="3"
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Seçenekler
              </label>
              {question.options.map((option, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-slate-700 mr-2">
                        {String.fromCharCode(65 + index)})
                      </span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...question.options];
                          newOptions[index] = e.target.value;
                          setQuestion({ ...question, options: newOptions });
                        }}
                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuestion({ ...question, correctAnswer: index })}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      index === question.correctAnswer
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {index === question.correctAnswer ? 'Doğru Cevap ✓' : 'Doğru Cevap Yap'}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Ekleniyor...' : 'Soru Ekle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddQuestionPage;