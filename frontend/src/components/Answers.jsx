import { useRef } from "react";


export default function Answers({answers, selectedAnswer, answeredState, onSelectAnswer}) {

    const shuffledAnswers = useRef();

    if(!shuffledAnswers.current) {
        shuffledAnswers.current = [...answers];
        shuffledAnswers.current.sort(() => Math.random() - 0.5);
    }
    
    return (
        <ul id="answers">
                {shuffledAnswers.current.map((answer, index) => {
                    let cssClass = ''
                    const isSelected = selectedAnswer === answer;

                    if(answeredState === 'answered' && isSelected){
                        cssClass = 'selected';
                    }

                    if((answeredState === 'correct' || answeredState === 'wrong') && isSelected){
                        cssClass = answeredState;
                    }
                            
                    
                    return (
                    <li key={index} className="answer">
                        
                        <button
                            className={cssClass}
                            onClick={() => answeredState === '' && onSelectAnswer(answer)}
                            disabled={answeredState !== ''}
                        >{ answer }</button>
                    </li>
                ) })}
            </ul>
    )
}