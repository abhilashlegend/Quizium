import Header from "./components/Header";
import Instructions from "./components/Instructions";
import Quiz from "./components/Quiz";
import { useState } from "react";
import { BrowserRouter } from 'react-router-dom';
import ErrorHandler from "./components/ErrorHandler";

function App() {
    const [quizStarted, setQuizStarted] = useState(false);

    function startQuiz() {
        setQuizStarted(true);
    }
    return (
        <>
            <Header />
            <main>
                { !quizStarted ? <Instructions start={startQuiz} /> : <Quiz /> }
            
            </main>
        </>
    )
}

export default App;
