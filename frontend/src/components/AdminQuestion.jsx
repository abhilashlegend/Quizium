import classes from './AdminQuestion.module.css';
import { Button } from 'react-bootstrap';
import { Pencil, Trash } from 'react-bootstrap-icons';
import AdminQuestionOptions from './AdminQuestionOptions';
import { getAuthToken } from '../util/auth';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';

export default function AdminQuestion({editQuestionHandler, data, sl}) {

    const options = data.options;
    const navigate = useNavigate();


    async function deleteQuestionHandler(questionId) {
        const token = getAuthToken();
        const url = API_URL + `admin/questions/${questionId}/`;

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization' : 'bearer ' + token
            }
        });

        if(!response.ok){           
                 throw new Response(JSON.stringify({message: 'Could not delete question.'}), { status: 500, headers: { 'Content-Type': 'application/json' }});
        }
    
        navigate(`/admin/quizzes/${data.quiz}/questions?message=Question deleted successfully`, { replace: true });
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
                    <Button className='btn btn-success me-2' onClick={() => editQuestionHandler('Edit', data._id)}><Pencil size={14} className='me-1' /> Edit </Button>
                    <Button className='btn btn-danger me-2' onClick={() => deleteQuestionHandler(data._id)}><Trash size={14} className='me-1' /> Delete</Button>
                </div>
            </div>
        </div>
    )
}