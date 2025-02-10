"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

const EditQuestion = () => {
  const router = useRouter();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [question, setQuestion] = useState({
    category: "",
    difficulty: "Orta",
    question: "",
    options: ["", "", "", "", ""],
    correctAnswer: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const isAuth = sessionStorage.getItem("adminAuth");
    if (!isAuth) {
      router.push("/admin");
      return;
    }
    fetchCategories();
    if (params.id) {
      fetchQuestion(params.id);
    }
  }, [params.id]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Kategoriler yüklenirken bir hata oluştu");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchQuestion = async (questionId) => {
    try {
      const response = await fetch(`/api/questions?id=${questionId}`);
      if (!response.ok) {
        throw new Error("Soru yüklenirken bir hata oluştu");
      }
      const data = await response.json();
      setQuestion(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !question.category ||
        !question.question ||
        question.options.some((opt) => !opt.trim())
      ) {
        throw new Error("Lütfen tüm alanları doldurun");
      }

      const response = await fetch(`/api/questions?id=${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(question),
      });

      if (!response.ok) {
        throw new Error("Soru güncellenirken bir hata oluştu");
      }

      setSuccessMessage("Soru başarıyla güncellendi");
      setTimeout(() => {
        router.push("/admin/panel");
      }, 1500);
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/admin/panel")}
            className="flex items-center text-slate-600 hover:text-slate-800"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" />
            Geri Dön
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Soru Düzenle</h1>
        </div>

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
                  onChange={(e) =>
                    setQuestion({ ...question, category: e.target.value })
                  }
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
                  onChange={(e) =>
                    setQuestion({ ...question, difficulty: e.target.value })
                  }
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
                onChange={(e) =>
                  setQuestion({ ...question, question: e.target.value })
                }
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
                    onClick={() =>
                      setQuestion({ ...question, correctAnswer: index })
                    }
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      index === question.correctAnswer
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {index === question.correctAnswer
                      ? "Doğru Cevap ✓"
                      : "Doğru Cevap Yap"}
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
                {loading ? "Güncelleniyor..." : "Güncelle"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditQuestion;
