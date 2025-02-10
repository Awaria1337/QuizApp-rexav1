import React, { useState } from "react";

const QuestionForm = () => {
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    categoryId: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your form submission logic here
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <form onSubmit={handleSubmit} className="question-form">
      <select
        value={formData.categoryId}
        onChange={(e) =>
          setFormData({ ...formData, categoryId: e.target.value })
        }
        required
      >
        <option value="">Kategori Seçin</option>
      </select>

      <input
        type="text"
        placeholder="Soru"
        value={formData.question}
        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
        required
      />

      {formData.options.map((option, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Seçenek ${index + 1}`}
          value={option}
          onChange={(e) => handleOptionChange(index, e.target.value)}
          required
        />
      ))}

      <select
        value={formData.correctAnswer}
        onChange={(e) =>
          setFormData({ ...formData, correctAnswer: e.target.value })
        }
        required
      >
        <option value="">Doğru Cevabı Seçin</option>
        {formData.options.map(
          (option, index) =>
            option && (
              <option key={index} value={index}>
                {option}
              </option>
            )
        )}
      </select>

      <input
        type="text"
        placeholder="Açıklama"
        value={formData.explanation}
        onChange={(e) =>
          setFormData({ ...formData, explanation: e.target.value })
        }
      />

      <button type="submit">Soru Ekle</button>
    </form>
  );
};

export default QuestionForm;
