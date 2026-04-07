import { Suspense, useState, useEffect } from 'react';
import { Await, Link, redirect, useLoaderData, useSearchParams } from 'react-router-dom';
import { Spinner, Table, Button } from 'react-bootstrap';
import { Pencil, Trash2Fill, Plus } from 'react-bootstrap-icons';
import { API_URL } from '../../config';
import { getAuthToken } from '../../util/auth';

export default function Quizzes() {

    const { quizzes } = useLoaderData();

    const [message, setMessage] = useState('');
    const [searchParams] = useSearchParams();

    useEffect(() => {
        setMessage(searchParams.get("message"));
    }, [searchParams])

    async function deleteQuizHandler(quizId) {
            const token = getAuthToken();
            const url = API_URL + 'admin/delete-quiz/' + quizId;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization' : 'bearer ' + token
                }
            })
    
            if(!response.ok){
                    setMessage('Failed to delete quiz');
                 throw new Response(JSON.stringify({message: 'Could not delete quiz.'}), { status: 500, headers: { 'Content-Type': 'application/json' }});
                 return
            }
    
            setMessage('quiz deleted successfully');
    
            redirect("/admin/quizzes")
            
    }

    return (
        <Suspense fallback={
            <div className="d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status">
                    <span className='visually-hidden'>Loading quizzes...</span>
                </Spinner>
            </div>
        }>
             <div className="container px-4 py-5 cbg" id="quizzes">
                            <div className='row border-bottom'>
                                <div className='col-md-6'>
                                    <h2 className="pb-2 ">Quizzes</h2>
                                </div>
                                <div className='col-md-6'>
                                    <div className='d-flex justify-content-end'>
                                        <Link to={`/admin/new-quiz/`} className='btn btn-success me-2'><Plus size={14} className='me-1' /> New Quiz</Link>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row g-4 py-3 row-cols-1 row-cols-lg-3">
                                { message && ( 
                                    <div className='alert alert-success text-center'>
                                        { message }
                                    </div>
                                )}
                                
                                <Await resolve={quizzes}>
                                    
                                    {(resolvedQuizzes) => resolvedQuizzes && resolvedQuizzes.length > 0 ? (
                                        <Table bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Title</th>
                                                    <th>Description</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {resolvedQuizzes.map((quiz, index) => (
                                                    <tr key={quiz._id || index} className='align-middle'>
                                                        <td>{index + 1}</td>
                                                        <td>{quiz.title}</td>
                                                        <td>{quiz.description}</td>
                                                        <td>
                                                            <Link to={`/admin/edit-quiz/${quiz._id}`} className='btn btn-success action-btn me-2'><Pencil size={14} className='me-1 action-icon' /> Edit</Link>
                                                            <Button className='btn btn-danger action-btn' onClick={() => deleteQuizHandler(quiz._id)}><Trash2Fill size={14} className='me-1 action-icon' /> Delete</Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <p className='text-center w-100'>No quizzes found</p>
                                    )}
                                </Await>
                                
                                
                            </div>
                      </div>
        </Suspense>
    )
}


async function getQuizzes() {
    const token = getAuthToken();

    const url = API_URL + 'admin/quizzes';

    const response = await fetch(url, {
        headers: {
            'Authorization' : 'bearer ' + token
        },
        method: 'GET'
    });

    if(!response.ok){
        throw new Response(JSON.stringify({message: 'Could not fetch quizzes'}), { status: 500, headers: { 'Content-Type': 'application/json' }})
    }

    const resData = await response.json();

    return resData.quizzes;
}

export function loader() {
    return {
        quizzes: getQuizzes()
    }
}