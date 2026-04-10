import { Button, Modal } from 'react-bootstrap';
import { Plus } from 'react-bootstrap-icons';

export default function Questions() {
    return (
        <div className="container px-4 py-5 cbg" id="quizzes">
            <div className='row border-bottom'>
                <div className='col-md-6'>
                    <h2 className="pb-2 ">Questions</h2>
                </div>
                <div className='col-md-6'>
                    <div className='d-flex justify-content-end'>
                        <Button className='btn btn-success me-2'><Plus size={14} className='me-1' /> Add Question</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}