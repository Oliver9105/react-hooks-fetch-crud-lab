import React from "react";
import QuestionItem from "./QuestionItem";

function QuestionList({questions, onSetQuestions}) {

  function handleDeleteQuestion(qId){
    fetch(`http://localhost:4000/questions/${qId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(resp => resp.json())
      .then(() => {
        const remainingQs = questions.filter((q) => q.id !== qId)
        onSetQuestions(remainingQs)
      })
  }

  function handleAnswerChange(qId, qCorrectIndex){
    fetch(`http://localhost:4000/questions/${qId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "correctIndex": qCorrectIndex
      })
    }).then(resp => resp.json())
      .then(console.log(qCorrectIndex))
  }

  const listQuestions = questions.map((q) => {
    return <QuestionItem onAnswerChange={handleAnswerChange} onDeleteQuestion={handleDeleteQuestion} key={q.id} question={q} />
  })

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>{listQuestions}</ul>
    </section>
  );
}

export default QuestionList;