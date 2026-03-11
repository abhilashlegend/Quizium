export default function QuizBlock({title, description}){
    return (
        <div className="feature col">
            <h2>{title}</h2>
            <p>{description}</p>

            <button className="main-button">Attempt</button>
        
        </div>
    )
}