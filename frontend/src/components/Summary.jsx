import TropyImage from '../assets/quiz-complete.png';
import QUESTIONS from '../questions';

export default function Summary({userAnswers}) {

    const skippedAnswers = userAnswers.filter(answer => answer === null).length;
    const correctAnswers = userAnswers.filter((answer, index) => answer === QUESTIONS[index].answers[0]).length;
    const totalQuestions = QUESTIONS.length;
    const incorrectAnswers = totalQuestions - skippedAnswers - correctAnswers;  

    const skippedPercentage = Math.round((skippedAnswers / totalQuestions) * 100);
    const correctPercentage = Math.round((correctAnswers / totalQuestions) * 100);
    const incorrectPercentage = Math.round((incorrectAnswers / totalQuestions) * 100);  

    

    return (
        <div id="summary">
            <img src={TropyImage} alt="Quiz Completed" />
            <h2>Quiz Completed!</h2>
            <div id='summary-stats'>
                <p>
                    <span className='number'>{ skippedPercentage }%</span>
                    <span className='text'>skipped</span>
                </p>
                <p>
                    <span className='number'>{ correctPercentage }%</span>
                    <span className='text'>answered correctly</span>
                </p>
                <p>
                    <span className='number'>{ incorrectPercentage }%</span>
                    <span className='text'>answered incorrectly</span>
                </p>
                
            </div>
            <ol>
                {userAnswers.map((answer, index) => {
                    let cssClass = 'user-answer';

                    if(answer === null) {
                        cssClass += ' skipped';
                    } else if (answer === QUESTIONS[index].answers[0]) {
                        cssClass += ' correct';
                    } else {
                        cssClass += ' wrong';
                    }

                    return (
                    <li key={index}>
                        <h3>{ index + 1 }</h3>
                        <p className='question'>{QUESTIONS[index].text}</p>
                        <p className={cssClass}>{ answer ?? QUESTIONS[index].answers[0] }</p>
                    </li>
                    )
                    }) 
                }
                
            </ol>
        </div>
    );
}