import classes from './AdminQuestion.module.css';
import { Button } from 'react-bootstrap';
import { Pencil, Trash } from 'react-bootstrap-icons';
import AdminQuestionOptions from './AdminQuestionOptions';

export default function AdminQuestion({editQuestionHandler, data, sl}) {

    const options = data.options;

    function deleteQuestionHandler() {

    }
    return (
        <div className='row pb-3 border-bottom'>
            <div className='col-md-12'>
                <div className={classes.question}>
                    {sl + 1}. {data.question}
                </div>
                <div className='py-1'>
                    <ul className={classes.options}>
                        {options.map((option, index) => {                           
                            return (
                            <AdminQuestionOptions key={index} correctAnswer={data.correctAnswer} index={index} option={option} />
                        )}
                        )}
                    </ul>
                </div>
                <div className='question-actions'>
                    <Button className='btn btn-success me-2' onClick={() => editQuestionHandler('Edit Question', data._id)}><Pencil size={14} className='me-1' /> Edit </Button>
                    <Button className='btn btn-danger me-2' onClick={deleteQuestionHandler}><Trash size={14} className='me-1' /> Delete</Button>
                </div>
            </div>
        </div>
    )
}