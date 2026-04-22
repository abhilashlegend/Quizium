import classes from './AdminQuestionOptions.module.css'

export default function AdminQuestionOptions({correctAnswer, option, index }) {
    const letter = String.fromCharCode(65 + index);

    return (
         <li className={correctAnswer === option ? classes["correct-option"] : classes.option}>
            <span className={correctAnswer === option ? classes["correct-sl"] : classes["opt-sl"]}>{letter}</span>
                { option.charAt(0).toUpperCase() + option.slice(1) }
        </li>
    )
}