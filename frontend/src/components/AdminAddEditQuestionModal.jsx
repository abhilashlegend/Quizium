import { Modal, Button } from "react-bootstrap"
import { useState, useEffect } from "react";
import { getAuthToken } from '../util/auth';
import { API_URL } from '../config';
import { useParams, useRevalidator } from "react-router-dom";

export default function AdminAddEditQuestionModal({show, handleClose, questionId, mode}) {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [errors, setErrors] = useState({});
    const { quizId } = useParams();
    const revalidator = useRevalidator();

    function closeModal() {
        setQuestion("");
        setOptions(["", ""]);
        setCorrectAnswer("");
        setErrors({});
        handleClose();
    }

    function addOption() {
        if(options.length < 8) {
            setOptions([...options, ""]); 
        }
    }

    function removeOption(index) {
        if(options.length > 2){
            setOptions(options.filter((_, i) => i !== index));
        }
    }

    async function getQuestion(questionId) {
        try {
             const url = API_URL + `admin/quizzes/${quizId}/questions/${questionId}`;
             const token = getAuthToken();
             const response = await fetch(url, {
                headers: {
                    'Authorization' : 'bearer ' + token
                }
            });

            if(!response.ok){
                throw new Response(JSON.stringify({message: 'Could not get question'}), { status: 500, headers: { 'Content-Type' : 'application/json' } })
            }

            const resData = await response.json();

            return resData.question;


        } catch(err){
            throw new Response(JSON.stringify({message: 'Could not get question'}), { status: 500, headers: { 'Content-Type' : 'application/json' } })
        }
    }

    useEffect(() => {
        if(questionId !== null){
          getQuestion(questionId).then(result => {
            setQuestion(result[0].question);
            setOptions([result[0].options[0], result[0].options[1], result[0].options[2], result[0].options[3]]);
            setCorrectAnswer(result[0].correctAnswer);
          }).catch(err => {
            console.log(err);
          })
        }
    }, [questionId])

    async function submitHandler(e) {
        e.preventDefault();
    
        const payload = {
            question: question,
            options: options,
            correctAnswer
        }
    
        try {
            const token = getAuthToken();

            let res = null;

            if(mode === 'Add'){
                 const url = API_URL + `admin/quizzes/${quizId}/questions`;
            

                res = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: 'bearer ' + token,
                    },
                    body: JSON.stringify(payload)
                });
            } else {
                 const url = API_URL + `admin/question/${questionId}`;
                 res = await fetch(url, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: 'bearer ' + token,
                    },
                    body: JSON.stringify(payload)
                });
            }
           

            const data = await res.json();

            if(!res.ok){
                console.error("Something went wrong!"); 
                const fieldErrors = {};
                if(data.data){
                    data.data.forEach(err => {
                        fieldErrors[err.path] = err.msg;
                    });
                }
                setErrors(fieldErrors);
                return;
            }


            // Reset form
            setQuestion("");
            setOptions(["", ""]);
            setCorrectAnswer("");
            setErrors({});
            handleClose();
            revalidator.revalidate();
        } catch(err){
            console.log(err);
            return Response.json(JSON.stringify({message: 'Something went wrong!'}), { status: 500, headers: { 'Content-type' : 'application/json' } })
        }
    }

    return (
        <Modal show={show} onHide={closeModal} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>{ mode === 'Add' ? 'Add Question' : 'Edit Question' }</Modal.Title>
                </Modal.Header>
                <form method='POST'>
                    <Modal.Body>
                        <div className='col-md-12'>
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="question"><span aria-label='required'>* </span>Question</label>
                                <input type="text" id="question" name="question" value={question} onChange={e => setQuestion(e.target.value)} className="form-control form-control-lg" required />
                                {errors.question && <small className='text-danger'>{errors.question}</small>}
                            </div>
                            <div className='row'>
                                {options.map((opt, index) => {
                                    // Convert index to alphabetic label (A, B, C, ...)
                                    const label = String.fromCharCode(65 + index); // 65 = 'A' in ASCII

                                    return (
                                    <div key={index} className="form-outline mb-4">
                                        <label className="form-label">Option {label}</label>
                                        <input type="text" value={opt} 
                                            onChange={e => {
                                                const newOptions = [...options];
                                                newOptions[index] = e.target.value;
                                                setOptions(newOptions);
                                            }}
                                            className="form-control form-control-lg" required />
                                            {options.length > 2 && (
                                                <Button variant="outline-danger" size="sm"
                                                    onClick={() => removeOption(index)}
                                                    className="mt-2">Remove</Button>
                                            )}

                                             {errors[`options[${index}]`] && (
                                                <small className='text-danger'>{errors[`options[${index}]`]}</small>
                                            )}
                                    </div>
                                );
                                })}
                                 <div className="form-outline mb-4">
                                        <Button variant="outline-primary" onClick={addOption} disabled={options.length >= 8} > Add Option </Button>
                                 </div>
                            </div>
                           
                           
                             
                             <div className='row'>
                                  <div className="form-outline mb-4 col-sm-12">
                                    <label className="form-label" htmlFor="correctAnswer"><span aria-label='required'>* </span> Correct Answer</label>
                                    <select 
                                    id="correctAnswer" 
                                    value={correctAnswer}
                                    onChange={e => setCorrectAnswer(e.target.value)}
                                    className="form-control form-control-lg" 
                                    required
                                    >
                                    <option value="">Select correct option</option>
                                    { options.map((option, index) => {
                                        return (
                                            <option key={index} value={option}>{option}</option>
                                        )
                                        })}
                                    
                                    </select>
                                    {errors.correctAnswer && <small className='text-danger'>{errors.correctAnswer}</small>}
                                </div>
                             </div>
                            
                            
                        </div>
                    </Modal.Body>
                    <Modal.Footer className='justify-content-center'>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={submitHandler}>
                        {mode === 'Add' ? 'Submit' : 'Update'}
                    </Button>
                    </Modal.Footer>
                </form>
            </Modal>
    )
}