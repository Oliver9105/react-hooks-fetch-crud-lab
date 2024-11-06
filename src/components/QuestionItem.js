import React from "react";

function QuestionItem({ question, onDelete, onCorrectAnswerChange }) {
  const { id, prompt, answers, correctIndex } = question;

  const options = answers.map((answer, index) => (
    <option key={index} value={index}>
      {answer}
    </option>
  ));

  function handleCorrectAnswerChange(event) {
    const newCorrectIndex = parseInt(event.target.value, 10);
    onCorrectAnswerChange(id, newCorrectIndex); 
  }

  return (
    <li>
      <h4>Question {id}</h4>
      <h5>Prompt: {prompt}</h5>
      <label>
        Correct Answer:
        <select 
          value={correctIndex} 
          onChange={handleCorrectAnswerChange} 
          aria-label="Select correct answer"
        >
          {options}
        </select>
      </label>

      <button onClick={() => onDelete(question.id)}>Delete Question</button>
    </li>
  );
}

export default React.memo(QuestionItem); 