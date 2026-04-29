import { Button, Modal, Spinner } from 'react-bootstrap';
import { Plus } from 'react-bootstrap-icons';
import { useState, Suspense, useEffect } from 'react';
import { getAuthToken } from '../../util/auth';
import { API_URL } from '../../config';
import { useParams, useLoaderData, Await, useSearchParams } from 'react-router-dom'; // useEffect is from 'react', not 'react-router-dom'
import AdminQuestion from '../../components/AdminQuestion';
import AdminAddEditQuestionModal from '../../components/AdminAddEditQuestionModal';


export default function Questions() {

    const [show, setShow] = useState(false);  
    const [mode, setMode] = useState(null)
    const { quizId } = useParams();
    const { questions } = useLoaderData();
    const [questionId, setQuestionId] = useState(null);

    const [message, setMessage] = useState(''); // Declare message as a state variable
    const [searchParams] = useSearchParams(); 

    useEffect(() => { // Use useEffect to update message from search params
        setMessage(searchParams.get("message"));
    }, [searchParams])


    const handleClose = () => {
        setShow(false);
        setQuestionId(null);
    }

    const handleShow = (mode, qId = null) => {
        setMode(mode);
        setShow(true);
        setQuestionId(qId);
    }



    return (
        <>
            <div className="container px-4 py-5 cbg" id="quizzes">
                <div className='row border-bottom'>
                    <div className='col-md-6'>
                        <h2 className="pb-2 ">Questions</h2>
                    </div>
                    <div className='col-md-6'>
                        <div className='d-flex justify-content-end'>
                            <Button className='btn btn-success me-2' onClick={() => handleShow('Add')}><Plus size={14} className='me-1' /> Add Question</Button>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <Suspense fallback={
                        <div className="d-flex justify-content-center align-items-center">
                            <Spinner animation="border" role="status">
                                <span className='visually-hidden'>Loading quizzes...</span>
                            </Spinner>
                        </div>
                    }>
                        <div className="container px-4 py-2 cbg" id="quizzes">
                             { message && ( 
                                <div className='row pb-3 border-bottom'>
                                    <div className='col-md-12'>
                                        <div className='alert alert-success text-center'>
                                            { message }
                                        </div>
                                    </div>
                                </div>
                                )}
                            <Await resolve={questions}>
                                {(resolvedQuestions) => resolvedQuestions && resolvedQuestions.length > 0 ? (
                                    <>
                                        {resolvedQuestions.map((questionData, index) => (
                                            <AdminQuestion key={questionData._id || index} data={questionData} sl={index} editQuestionHandler={handleShow}  />
                                         ))}
                                    </>
                                    
                                        
                                ) : (
                                        <p className='text-center w-100'>No questions found</p>
                                )}
                            </Await>
                            
                        </div>
                    </Suspense>
                </div>
            </div>
             <AdminAddEditQuestionModal show={show} handleClose={handleClose} mode={mode} questionId={questionId} />
        </>
    )
}

async function getQuestions(quizId) {
    const token = getAuthToken();

    const url = API_URL + `admin/quizzes/${quizId}/questions`;

    const response = await fetch(url, {
        headers: {
            'Authorization' : 'bearer ' + token
        }
    });

    if(!response.ok){
        throw new Response(JSON.stringify({message: 'Could not get questions'}), { status: 500, headers: { 'Content-Type' : 'application/json' } })
    }

    const resData = await response.json();

    return resData.questions;
}

export function loader({request, params}) {
    const quizId = params.quizId;

    return {
        questions: getQuestions(quizId)
    }
}