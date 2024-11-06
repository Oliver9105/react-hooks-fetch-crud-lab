import React, { useState, useEffect } from "react";
import QuestionItem from "./QuestionItem"; 

function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(true); 

  useEffect(() => {
    setIsLoading(true); // Start loading when the component mounts
    fetch("http://localhost:4000/questions")
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) {
          setQuestions(data);
          setIsLoading(false); // Set loading to false once data is fetched
        }
      })
      .catch((error) => {
        if (isMounted) {
          setError("Error fetching questions. Please try again.");
          setIsLoading(false);
        }
      });

    return () => {
      setIsMounted(false);
    };
  }, [isMounted]);

  function handleDelete(id) {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setQuestions((prevQuestions) =>
            prevQuestions.filter((question) => question.id !== id)
          );
        }
      })
      .catch((error) => {
        console.error("Error deleting question:", error);
        setError("Error deleting the question. Please try again.");
      });
  }

  function handleCorrectAnswerChange(id, newCorrectIndex) {
    const updatedQuestions = questions.map((question) => {
      if (question.id === id) {
        return { ...question, correctIndex: newCorrectIndex };
      }
      return question;
    });

    setQuestions(updatedQuestions);

    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correctIndex: newCorrectIndex }),
    })
      .then((response) => response.json())
      .then((updatedQuestion) => {
        console.log("Correct answer updated:", updatedQuestion);
      })
      .catch((error) => {
        console.error("Error updating correct answer:", error);
        setError("Error updating the correct answer. Please try again.");
      });
  }

  return (
    <section>
      <h1>Quiz Questions</h1>
      {isLoading && <p>Loading questions...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            onDelete={handleDelete}
            onCorrectAnswerChange={handleCorrectAnswerChange} 
          />
        ))}
      </ul>
    </section>
  );
}

export default QuestionList;
