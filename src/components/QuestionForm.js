import React, { useState, useEffect } from "react";

function QuestionForm({ onQuestionAdded }) {
  const [formData, setFormData] = useState({
    prompt: "",
    answers: ["", "", "", ""], // Use an array to store answers
    correctIndex: 0, // Index of the correct answer
  });

  const [error, setError] = useState(null); 
  const [success, setSuccess] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false); 

  useEffect(() => {
    let isMounted = true;
    return () => {
      isMounted = false; // Mark as unmounted on cleanup
    };
  }, []);


  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "prompt") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (name === "correctIndex") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: parseInt(value, 10), 
      }));
    } else {
      const answerIndex = parseInt(name.replace("answer", ""), 10); // Convert 'answerX' to index
      const newAnswers = [...formData.answers];
      newAnswers[answerIndex] = value;
      setFormData((prevData) => ({
        ...prevData,
        answers: newAnswers,
      }));
    }
  }
  function handleSubmit(event) {
    event.preventDefault();

    setIsSubmitting(true);

    const newQuestion = {
      prompt: formData.prompt,
      answers: formData.answers,
      correctIndex: formData.correctIndex,
    };

    if (onQuestionAdded) {
      onQuestionAdded(newQuestion);
    }

    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuestion),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add question.");
        }
        return response.json();
      })
      .then((createdQuestion) => {
        // Ensure that state updates only if the component is still mounted
        setSuccess(true);
        setError(null); 

        setFormData({
          prompt: "",
          answers: ["", "", "", ""],
          correctIndex: 0,
        });
      })
      .catch((error) => {
        setError("An error occurred while adding the question.");
        console.error("Error adding question:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <section>
      <h1>New Question</h1>

      {/* Show success or error messages */}
      {success && <p style={{ color: "green" }}>Question added successfully!</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input
            type="text"
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
            required
          />
        </label>

        {formData.answers.map((answer, index) => (
          <div key={index}>
            <label htmlFor={`answer${index}`}>
              Answer {index + 1}:
              <input
                id={`answer${index}`}
                type="text"
                name={`answer${index}`}
                value={answer}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        ))}

        <label>
          Correct Answer:
          <select
            name="correctIndex"
            value={formData.correctIndex}
            onChange={handleChange}
          >
            {formData.answers.map((answer, index) => (
              <option key={index} value={index}>
                {answer || `Answer ${index + 1}`}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Question"}
        </button>
      </form>
    </section>
  );
}

export default QuestionForm;