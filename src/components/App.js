import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    let isMounted = true;  // Track whether component is mounted
  
    fetch("http://localhost:4000/questions")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setQuestions(data);
        }
      })
      .catch((error) => console.error("Error fetching questions:", error));
  
    return () => {
      isMounted = false; // Cleanup function to set `isMounted` to false when component unmounts
    };
  }, []);
  function handleQuestionAdded(newQuestion) {
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  }

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
      });
  }

  function handleCorrectAnswerChange(id, newCorrectIndex) {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correctIndex: newCorrectIndex }),
    })
      .then((response) => {
        if (response.ok) {
          setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
              question.id === id ? { ...question, correctIndex: newCorrectIndex } : question
            )
          );
        }
      })
      .catch((error) => {
        console.error("Error updating question:", error);
      });
  }

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm onQuestionAdded={handleQuestionAdded} />
      ) : (
        <QuestionList
          questions={questions}
          onDelete={handleDelete}
          onCorrectAnswerChange={handleCorrectAnswerChange}
        />
      )}
    </main>
  );
}

export default App;