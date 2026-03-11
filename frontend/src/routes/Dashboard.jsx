import QuizBlock from "../components/QuizBlock"

export default function Dashboard() {
    return (
       <div className="container px-4 py-5 cbg" id="featured-3">
        <h2 className="pb-2 border-bottom">Quizes</h2>
        <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
            <QuizBlock title="HTML" description="Paragraph of text beneath the heading to explain the heading. We'll add onto it with another sentence and probably just keep going until we run out of words." />
            <QuizBlock title="ReactJS" description="Paragraph of text beneath the heading to explain the heading. We'll add onto it with another sentence and probably just keep going until we run out of words." />
            <QuizBlock title="NodeJS" description="Paragraph of text beneath the heading to explain the heading. We'll add onto it with another sentence and probably just keep going until we run out of words." />
        </div>
  </div>
    )
}