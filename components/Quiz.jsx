import React, { useState, useEffect } from "react";
import { decode } from 'html-entities';

export default function Quiz() {
  const [elements, setElements] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [correctCount, setCorrectCount] = useState(0);
  const [checked, setChecked] = useState(false);
  const [answerClasses, setAnswerClasses] = useState({});

  const fetchData = () => {
    fetch("https://opentdb.com/api.php?amount=5")
      .then(res => res.json())
      .then(data => {
        const shuffledData = data.results.map(element => ({
          ...element,
          shuffledAnswers: shuffle([element.correct_answer, ...element.incorrect_answers])
        }));
        setElements(shuffledData);
        setSelectedAnswers({});
        setAnsweredQuestions({});
        setAnswerClasses({});
        setCorrectCount(0);
        setChecked(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleAnswerClick = (questionIndex, answer) => {
    const isCorrect = answer === elements[questionIndex].correct_answer;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answer
    });
    setAnsweredQuestions({
      ...answeredQuestions,
      [questionIndex]: true
    });
    setAnswerClasses({
      ...answerClasses,
      [questionIndex]: isCorrect ? "correct-answer" : "incorrect-answer"
    });
  };


  const handleClick = () => {
    let count = 0;
    elements.forEach((element, index) => {
      if (selectedAnswers[index] === element.correct_answer) {
        count++;
      }
    });
    setCorrectCount(count);
    setChecked(true);
  };


  return (
    <div className="quiz-container">
      {elements.map((element, index) => (
        <div key={index}>
          <h3 className="quiz-question">{decode(element.question)}</h3>
          {element.shuffledAnswers.map((answer, idx) => (
            <button 
              key={idx}
              onClick={() => handleAnswerClick(index, answer)}
              className={
                answerClasses[index] && selectedAnswers[index] === answer
                 ? answerClasses[index]
                  : 'quiz-button'
              }
              disabled={answeredQuestions[index]}>
              {decode(answer)}
            </button>
          ))}
          <hr/>
        </div>
      ))}
      <br/>
      <button className="score-button" onClick={handleClick}>Check Answers</button>
      {checked && <p className="score-text">You got {correctCount} out of {elements.length} correct!</p>}
      {checked && <button className="newgame-button" onClick={fetchData}>Play Again</button>}
    </div>
  );
}
