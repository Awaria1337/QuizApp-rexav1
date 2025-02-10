'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import TasksPanel from '@/components/admin/panels/TasksPanel';
import ShopPanel from '@/components/admin/panels/ShopPanel';
import LevelsPanel from '@/components/admin/panels/LevelsPanel';
import AchievementsPanel from '@/components/admin/panels/AchievementsPanel';

const AdminPanel = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'categories');
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newQuestion, setNewQuestion] = useState({
    categoryId: '',
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCategories();
    fetchQuestions();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/categories', {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory || newCategory),
      });
      
      if (response.ok) {
        fetchCategories();
        setNewCategory({ name: '', description: '' });
        setEditingCategory(null);
        setSuccessMessage('Kategori başarıyla kaydedildi!');
      }
    } catch (error) {
      setError('Kategori kaydedilirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/questions', {
        method: editingQuestion ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingQuestion || newQuestion),
      });
      
      if (response.ok) {
        fetchQuestions();
        setNewQuestion({
          categoryId: '',
          text: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        });
        setEditingQuestion(null);
        setSuccessMessage('Soru başarıyla kaydedildi!');
      }
    } catch (error) {
      setError('Soru kaydedilirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
    
    try {
      const response = await fetch(`/api/categories?id=${categoryId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchCategories();
        setSuccessMessage('Kategori başarıyla silindi!');
      }
    } catch (error) {
      setError('Kategori silinirken bir hata oluştu');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm('Bu soruyu silmek istediğinize emin misiniz?')) return;
    
    try {
      const response = await fetch(`/api/questions?id=${questionId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchQuestions();
        setSuccessMessage('Soru başarıyla silindi!');
      }
    } catch (error) {
      setError('Soru silinirken bir hata oluştu');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'categories':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Kategori Yönetimi</h2>
            
            <form onSubmit={handleCategorySubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
              <div>
                <label className="block text-sm font-medium text-gray-700">Kategori Adı</label>
                <input
                  type="text"
                  value={editingCategory?.name || newCategory.name}
                  onChange={(e) => editingCategory 
                    ? setEditingCategory({...editingCategory, name: e.target.value})
                    : setNewCategory({...newCategory, name: e.target.value})
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                <textarea
                  value={editingCategory?.description || newCategory.description}
                  onChange={(e) => editingCategory
                    ? setEditingCategory({...editingCategory, description: e.target.value})
                    : setNewCategory({...newCategory, description: e.target.value})
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                {editingCategory && (
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    İptal
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {editingCategory ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category._id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setEditingCategory(category)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case 'questions':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Soru Yönetimi</h2>
            
            <form onSubmit={handleQuestionSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
              <div>
                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                <select
                  value={editingQuestion?.categoryId || newQuestion.categoryId}
                  onChange={(e) => editingQuestion
                    ? setEditingQuestion({...editingQuestion, categoryId: e.target.value})
                    : setNewQuestion({...newQuestion, categoryId: e.target.value})
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-gray-700">Soru</label>
                <textarea
                  value={editingQuestion?.text || newQuestion.text}
                  onChange={(e) => editingQuestion
                    ? setEditingQuestion({...editingQuestion, text: e.target.value})
                    : setNewQuestion({...newQuestion, text: e.target.value})
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Seçenekler</label>
                {(editingQuestion?.options || newQuestion.options).map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(editingQuestion?.options || newQuestion.options)];
                        newOptions[index] = e.target.value;
                        if (editingQuestion) {
                          setEditingQuestion({...editingQuestion, options: newOptions});
                        } else {
                          setNewQuestion({...newQuestion, options: newOptions});
                        }
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={`Seçenek ${index + 1}`}
                      required
                    />
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={index === (editingQuestion?.correctAnswer || newQuestion.correctAnswer)}
                      onChange={() => {
                        if (editingQuestion) {
                          setEditingQuestion({...editingQuestion, correctAnswer: index});
                        } else {
                          setNewQuestion({...newQuestion, correctAnswer: index});
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                {editingQuestion && (
                  <button
                    type="button"
                    onClick={() => setEditingQuestion(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    İptal
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {editingQuestion ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Soru</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {questions.map((question) => (
                    <tr key={question._id}>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{question.text}</div>
                        <div className="mt-2 space-y-1">
                          {question.options.map((option, index) => (
                            <div
                              key={index}
                              className={`text-sm ${
                                index === question.correctAnswer
                                  ? 'text-green-600 font-medium'
                                  : 'text-gray-500'
                              }`}
                            >
                              {index + 1}. {option}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {categories.find(c => c._id === question.categoryId)?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setEditingQuestion(question)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case 'tasks':
        return <TasksPanel />;
      
      case 'shop':
        return <ShopPanel />;
      
      case 'levels':
        return <LevelsPanel />;
      
      case 'achievements':
        return <AchievementsPanel />;
      
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      
      {renderTabContent()}
    </div>
  );
};

export default AdminPanel;