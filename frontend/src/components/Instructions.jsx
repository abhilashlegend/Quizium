export default function Instructions({start}) {
    return (
        <div className="dialog-backdrop">
  <dialog className="dialog" open>
    <h2>Welcome to the React Quiz!</h2>
     <p>Test your knowledge with this interactive quiz.
               You will have 15 seconds to answer each question.  
                Select the correct answers and see how well you do!</p>
    <div className="dialog-actions">
       <button id="start-quiz-button" onClick={start}>Start Quiz</button>
    </div>
  </dialog>
</div>
    )
}