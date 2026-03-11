import { useState, useCallback, useMemo } from "react";
import questions from "../questions";
import TropyLogo from "../assets/quiz-complete.png";
import Progressbar from "./Progressbar";
import Answers from "./Answers";
import Summary from "./Summary";

export default function Quiz() {
    const [userAnswers, setUserAnswers] = useState([]);
    const [answeredState, setAnsweredState] = useState('');
    
    const activeQuestionIndex = answeredState === '' ? userAnswers.length : userAnswers.length - 1;
    // clamp index to valid range to avoid out-of-bounds access when clicks happen quickly
    const clampedQuestionIndex = Math.max(0, Math.min(activeQuestionIndex, questions.length - 1));
    // Only show the completed summary after any "answered" feedback cycle finishes.
    // This prevents immediately showing the summary when the final answer is pushed
    // and lets the last question show its correct/wrong feedback first.
    const isQuizFinished = userAnswers.length === questions.length && answeredState === '';

    const handleAnswerSelection = useCallback((answer) => {
        setAnsweredState('answered');
        setUserAnswers(prevAnswers => [...prevAnswers, answer]);

        setTimeout(() => {
            // compare against the correct answer for the active question
            if (answer === questions[activeQuestionIndex].answers[0]) {
                setAnsweredState('correct');
            } else {
                setAnsweredState('wrong');
            }

            setTimeout(() => {
                setAnsweredState('');
            }, 2000);
        }, 1000);
    }, [activeQuestionIndex]);

    const skipQuestion = useCallback(() => {
        handleAnswerSelection(null);
    }, [handleAnswerSelection]);

    
    if (isQuizFinished) {
        return (
            <Summary userAnswers={userAnswers} />
        );
    }

    return (
        <div id="quiz">
            <Progressbar key={clampedQuestionIndex} timer={15000} onTimeout={skipQuestion} active={answeredState === ''} />
            <h2 id="question"> { questions[clampedQuestionIndex]?.text ?? '' } </h2>
            <Answers key={questions[clampedQuestionIndex]?.text ?? clampedQuestionIndex} answers={questions[clampedQuestionIndex]?.answers ?? []} selectedAnswer={userAnswers[userAnswers.length - 1]} answeredState={answeredState} onSelectAnswer={handleAnswerSelection} />
        </div>
    )
}