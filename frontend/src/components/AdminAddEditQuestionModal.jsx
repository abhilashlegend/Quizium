import { Modal, Button } from "react-bootstrap"
import { useState, useEffect } from "react";
import { getAuthToken } from '../util/auth';
import { API_URL } from '../config';
import { useParams } from "react-router-dom";

export default function AdminAddEditQuestionModal({show, handleClose, title, questionId}) {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState({ A: "", B: "", C: "", D: "" });
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [errors, setErrors] = useState({});
    const { quizId } = useParams();

    useEffect(() => {
        if(questionId !== null){
            const url = API_URL + `admin/quizzes/${quizId}/questions/${questionId}`;
            console.log(url);
        }
    }, [questionId])

    async function addQuestionHandler(e) {
        e.preventDefault();
    
        const payload = {
            question: question,
            options: [options.A, options.B, options.C, options.D],
            correctAnswer
        }
    
        try {
            const url = API_URL + `admin/quizzes/${quizId}/questions`;
            const token = getAuthToken();

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: 'bearer ' + token,
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if(!res.ok){
                console.error("Failed to add question"); 
                const fieldErrors = {};
                if(data.data){
                    data.data.forEach(err => {
                        fieldErrors[err.path] = err.msg;
                    });
                }
                setErrors(fieldErrors);
                return;
            }

            
            console.log("Question added:", data);

            // Reset form
            setQuestion("");
            setOptions({A: "", B: "", C: "", D: "" });
            setCorrectAnswer("");
            setErrors({});
            handleClose();
        } catch(err){
            console.log(err);
            return Response.json(JSON.stringify({message: 'Could not add question'}), { status: 500, headers: { 'Content-type' : 'application/json' } })
        }
    }

    return (
        <Modal show={show} onHide={handleClose} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
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
                                <div className="form-outline mb-4 col-sm-6">
                                 <label className="form-label" htmlFor="option-a"><span aria-label='required'>* </span>Option A</label>
                                <input type="text" id="option-a" name="A" value={options.A} onChange={e => setOptions({ ...options, A: e.target.value })} className="form-control form-control-lg" required />
                                {errors["options[0]"] && <small className='text-danger'>{errors["options[0]"]}</small>}
                            </div>
                            <div className="form-outline mb-4 col-sm-6">
                                 <label className="form-label" htmlFor="option-b"><span aria-label='required'>* </span>Option B</label>
                                <input type="text" id="option-b" name="B" value={options.B} onChange={e => setOptions({ ...options, B: e.target.value })} className="form-control form-control-lg" required />
                                {errors["options[1]"] && <small className='text-danger'>{errors["options[1]"]}</small>}
                            </div>
                            </div>
                             <div className='row'>
                                <div className="form-outline mb-4 col-sm-6">
                                    <label className="form-label" htmlFor="option-c"><span aria-label='required'>* </span>Option C</label>
                                    <input type="text" id="option-c" name="C" value={options.C} onChange={e => setOptions({ ...options, C: e.target.value })} className="form-control form-control-lg" required />
                                    {errors["options[2]"] && <small className='text-danger'>{errors["options[2]"]}</small>}
                                </div>
                                <div className="form-outline mb-4 col-sm-6">
                                    <label className="form-label" htmlFor="option-d"><span aria-label='required'>* </span>Option D</label>
                                    <input type="text" id="option-d" name="D" value={options.D} onChange={e => setOptions({ ...options, D: e.target.value })} className="form-control form-control-lg" required />
                                    {errors["options[3]"] && <small className='text-danger'>{errors["options[3]"]}</small>}
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
                                    <option value={options.A}>A</option>
                                    <option value={options.B}>B</option>
                                    <option value={options.C}>C</option>
                                    <option value={options.D}>D</option>
                                    </select>
                                    {errors.correctAnswer && <small className='text-danger'>{errors["options[0]"]}</small>}
                                </div>
                             </div>
                            
                            
                        </div>
                    </Modal.Body>
                    <Modal.Footer className='justify-content-center'>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addQuestionHandler}>
                        Submit
                    </Button>
                    </Modal.Footer>
                </form>
            </Modal>
    )
}