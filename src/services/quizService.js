import Quiz from '../models/Quiz';
import connectDB from '../lib/mongodb';

export const quizService = {
  // Kategorileri getir
  async getCategories() {
    try {
      await connectDB();
      return await Quiz.find({}).sort({ createdAt: -1 });
    } catch (error) {
      console.error("Kategoriler getirilirken hata:", error);
      throw error;
    }
  },

  // Soruları getir
  async getQuestions(categoryId, numberOfQuestions) {
    try {
      await connectDB();
      const questions = await Quiz.find({ categoryId });
      return questions
        .sort(() => Math.random() - 0.5)
        .slice(0, numberOfQuestions);
    } catch (error) {
      console.error("Sorular getirilirken hata:", error);
      throw error;
    }
  },

  // Quiz sonucunu kaydet
  async saveQuizResult(result) {
    try {
      await connectDB();
      const resultData = {
        ...result,
        timestamp: new Date(),
      };

      // Sonucu userResults koleksiyonuna kaydet
      const userResultRef = await Quiz.create(resultData);

      // Eğer yüksek skor ise lider tablosuna da ekle
      if (result.score > 0) {
        await Quiz.create({
          username: result.username || "Anonim",
          score: result.score,
          categoryId: result.categoryId,
          categoryName: result.categoryName,
          timestamp: new Date(),
        });
      }

      return userResultRef._id;
    } catch (error) {
      console.error("Sonuç kaydedilirken hata:", error);
      throw error;
    }
  },

  // Lider tablosunu getir
  async getLeaderboard(limit = 10) {
    try {
      await connectDB();
      const leaderboard = await Quiz.find()
        .sort({ score: -1, timestamp: -1 })
        .limit(limit);

      return leaderboard.map((doc) => ({
        id: doc._id,
        ...doc._doc,
        timestamp: doc._doc.timestamp,
      }));
    } catch (error) {
      console.error("Lider tablosu getirilirken hata:", error);
      throw error;
    }
  },

  // Kullanıcının geçmiş sonuçlarını getir
  async getUserResults(username) {
    try {
      await connectDB();
      const userResults = await Quiz.find({ username })
        .sort({ timestamp: -1 });

      return userResults.map((doc) => ({
        id: doc._id,
        ...doc._doc,
        timestamp: doc._doc.timestamp,
      }));
    } catch (error) {
      console.error("Kullanıcı sonuçları getirilirken hata:", error);
      throw error;
    }
  },
};
