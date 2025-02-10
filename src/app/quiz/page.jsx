'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');
  const count = parseInt(searchParams.get('count')) || 5;

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);

        // Önce kategori bilgisini al
        const categoryResponse = await fetch(
          `/api/categories?id=${categoryId}`
        );
        if (!categoryResponse.ok) {
          throw new Error('Kategori bilgisi alınamadı');
        }
        const categoryData = await categoryResponse.json();
        setCategory(categoryData);
        console.log('Kategori yüklendi:', categoryData);

        // Soruları getir
        const questionsResponse = await fetch(
          `/api/questions?category=${categoryId}&count=${count}`
        );
        if (!questionsResponse.ok) {
          throw new Error('Sorular yüklenirken bir hata oluştu');
        }
        const questionsData = await questionsResponse.json();
        console.log('Sorular yüklendi:', questionsData);
        setQuestions(questionsData);
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchQuestions();
    }
  }, [categoryId, count]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleQuizComplete = async (score) => {
    try {
        // Her doğru cevap için 20 XP
        const xpEarned = score * 20;
        
        const response = await fetch('/api/user/progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                xp: xpEarned,
                categoryId: categoryId,
                score: score,
                totalQuestions: questions.length
            })
        });

        const data = await response.json();
        
        if (data.levelUp) {
            // Level atlama animasyonu ve bildirimi
            setShowLevelUpModal(true);
        }

        setScore(score);
        setShowResult(true);
    } catch (error) {
        console.error('Quiz sonucu kaydedilirken hata:', error);
    }
};

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      alert('Lütfen bir cevap seçin');
      return;
    }

    // Doğru cevabı kontrol et
    if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    // Sonraki soruya geç veya sonucu göster
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold text-red-500 mb-4">{error}</p>
          <button
            onClick={handleBackToHome}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">
            Quiz Tamamlandı!
          </h2>
          <div className="text-center mb-8">
            <p className="text-xl mb-2">
              Toplam Skor: {score} / {questions.length}
            </p>
            <p className="text-lg text-gray-600">
              Başarı Oranı: {Math.round((score / questions.length) * 100)}%
            </p>
          </div>
          <div className="space-y-4">
            <button
              onClick={handleRestartQuiz}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Yeniden Başla
            </button>
            <button
              onClick={handleBackToHome}
              className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        {/* Başlık ve İlerleme */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{category?.name || 'Quiz'}</h2>
            <p className="text-gray-600">
              Soru {currentQuestionIndex + 1} / {questions.length}
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / questions.length) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Soru */}
        <div className="mb-8">
          <p className="text-lg font-medium mb-6">{currentQuestion.question}</p>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-3 text-left rounded-md border transition-colors ${
                  selectedAnswer === index
                    ? 'bg-blue-100 border-blue-500'
                    : 'hover:bg-gray-50 border-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Kontrol Butonları */}
        <div className="flex justify-between">
          <button
            onClick={handleBackToHome}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Çıkış
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className={`px-6 py-2 rounded-md text-white font-medium ${
              selectedAnswer === null
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Bitir' : 'İleri'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}