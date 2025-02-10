'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiEdit2, FiTrash2, FiDownload, FiUpload, FiPieChart } from 'react-icons/fi';
import AdminNav from '@/components/AdminNav';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

const QuestionsPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    byDifficulty: {},
    byCategory: {}
  });

  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuth');
    if (!isAuth) {
      router.push('/admin');
      return;
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchQuestions();
    }
  }, [selectedCategory]);

  useEffect(() => {
    calculateStats();
  }, [questions]);

  const calculateStats = () => {
    const newStats = {
      total: questions.length,
      byDifficulty: {},
      byCategory: {}
    };

    questions.forEach(question => {
      // Zorluk seviyesine göre
      newStats.byDifficulty[question.difficulty] = (newStats.byDifficulty[question.difficulty] || 0) + 1;
      
      // Kategoriye göre
      const category = categories.find(c => c._id === question.category)?.name || 'Bilinmeyen';
      newStats.byCategory[category] = (newStats.byCategory[category] || 0) + 1;
    });

    setStats(newStats);
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Kategoriler yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setCategories(data);
      if (data.length > 0) {
        setSelectedCategory(data[0]._id);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/questions?category=${selectedCategory}`);
      if (!response.ok) {
        throw new Error('Sorular yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Bu soruyu silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/questions?id=${questionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Soru silinirken bir hata oluştu');
      }

      setSuccessMessage('Soru başarıyla silindi');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchQuestions();
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`${selectedQuestions.length} soruyu silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      for (const questionId of selectedQuestions) {
        await fetch(`/api/questions?id=${questionId}`, {
          method: 'DELETE',
        });
      }

      setSuccessMessage(`${selectedQuestions.length} soru başarıyla silindi`);
      setSelectedQuestions([]);
      fetchQuestions();
    } catch (error) {
      setError('Toplu silme işlemi sırasında bir hata oluştu');
    }
  };

  const handleBulkImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      Papa.parse(text, {
        header: true,
        complete: async (results) => {
          const questions = results.data.map(row => ({
            category: selectedCategory,
            question: row.question,
            options: [row.option1, row.option2, row.option3, row.option4, row.option5],
            correctAnswer: parseInt(row.correctAnswer) - 1,
            difficulty: row.difficulty || 'Orta'
          }));

          for (const question of questions) {
            await fetch('/api/questions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(question),
            });
          }

          setSuccessMessage(`${questions.length} soru başarıyla içe aktarıldı`);
          fetchQuestions();
        }
      });
    } catch (error) {
      setError('Dosya içe aktarılırken bir hata oluştu');
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Başlık
    doc.setFontSize(20);
    doc.text('Quiz Soruları', 14, 15);
    
    // Kategori bilgisi
    const categoryName = categories.find(c => c._id === selectedCategory)?.name;
    doc.setFontSize(12);
    doc.text(`Kategori: ${categoryName}`, 14, 25);
    
    // Tablo verilerini hazırla
    const tableData = questions.map((q, index) => [
      index + 1,
      q.question,
      q.options.join('\n'),
      String.fromCharCode(65 + q.correctAnswer),
      q.difficulty
    ]);
    
    // Tabloyu oluştur
    doc.autoTable({
      startY: 30,
      head: [['#', 'Soru', 'Seçenekler', 'Doğru Cevap', 'Zorluk']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 60 },
        2: { cellWidth: 70 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 }
      }
    });
    
    // PDF'i indir
    doc.save(`quiz-sorulari-${categoryName}.pdf`);
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.options.some(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = !difficultyFilter || question.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Kolay':
        return 'bg-green-100 text-green-800';
      case 'Orta':
        return 'bg-yellow-100 text-yellow-800';
      case 'Zor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <>
      <AdminNav title="Quiz Admin">
        <div className="flex space-x-2">
          <button
            onClick={() => router.push('/admin/questions/add')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="mr-2" />
            Yeni Soru Ekle
          </button>
          <button
            onClick={() => setShowStats(!showStats)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-slate-600 hover:bg-slate-50"
          >
            <FiPieChart className="mr-2" />
            İstatistikler
          </button>
        </div>
      </AdminNav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Messages */}
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

        {/* Statistics Modal */}
        {showStats && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Soru İstatistikleri</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Genel Bilgiler</h3>
                  <p className="text-slate-600">Toplam Soru: {stats.total}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Zorluk Seviyesine Göre</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(stats.byDifficulty).map(([difficulty, count]) => (
                      <div key={difficulty} className={`p-4 rounded-lg ${getDifficultyColor(difficulty)}`}>
                        <div className="font-medium">{difficulty}</div>
                        <div className="text-2xl font-bold">{count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Kategorilere Göre</h3>
                  <div className="space-y-2">
                    {Object.entries(stats.byCategory).map(([category, count]) => (
                      <div key={category} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                        <span>{category}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowStats(false)}
                className="mt-6 w-full px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300"
              >
                Kapat
              </button>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kategori
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Zorluk Seviyesi
              </label>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Tümü</option>
                <option value="Kolay">Kolay</option>
                <option value="Orta">Orta</option>
                <option value="Zor">Zor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ara
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Soru veya cevap ara..."
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <label className="relative inline-flex items-center">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleBulkImport}
                  className="sr-only"
                />
                <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer">
                  <FiUpload className="mr-2" />
                  CSV İçe Aktar
                </span>
              </label>
              <button
                onClick={exportToPDF}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                <FiDownload className="mr-2" />
                PDF Dışa Aktar
              </button>
            </div>

            {selectedQuestions.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <FiTrash2 className="mr-2" />
                Seçilenleri Sil ({selectedQuestions.length})
              </button>
            )}
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-slate-600">Yükleniyor...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question, index) => (
              <div
                key={question._id}
                className="bg-white shadow rounded-lg p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedQuestions([...selectedQuestions, question._id]);
                        } else {
                          setSelectedQuestions(selectedQuestions.filter(id => id !== question._id));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-sm font-medium text-slate-500">
                          Soru {index + 1}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-slate-900 mb-4">
                        {question.question}
                      </h3>
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-3 rounded-lg ${
                              optIndex === question.correctAnswer
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-slate-50'
                            }`}
                          >
                            <span className="font-medium">
                              {String.fromCharCode(65 + optIndex)})
                            </span>{' '}
                            {option}
                            {optIndex === question.correctAnswer && (
                              <span className="ml-2 text-green-600">✓</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => router.push(`/admin/questions/edit/${question._id}`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      title="Düzenle"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      title="Sil"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredQuestions.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-slate-600">Bu kriterlere uygun soru bulunamadı.</p>
                <button
                  onClick={() => router.push('/admin/questions/add')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100"
                >
                  <FiPlus className="mr-2" />
                  Yeni Soru Ekle
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default QuestionsPage;
