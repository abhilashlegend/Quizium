import { Form, useNavigation, useNavigate, redirect } from 'react-router-dom';
import { getAuthToken } from '../../util/auth';
import { API_URL } from '../../config';

export default function NewQuiz() {

    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';
    const navigate = useNavigate();

    function handleCancel() {
        navigate('/admin/quizzes/')
    }

    return (
         <div className="container px-4 py-5 cbg h-100">
            <h2 className="pb-2 border-bottom">New Quiz</h2>
            <Form method="POST">
                <div className="row">
                    <div className='col-md-6 offset-md-3'>
                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="title"><span aria-label='required'>* </span>Title</label>
                            <input type="text" id="title" name="title" className="form-control form-control-lg" required />
                        </div>
                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="title">Description</label>
                            <textarea id="description" name="description" className="form-control form-control-lg" rows="5"></textarea>
                        </div>

                        <div className="form-outline mb-4">
                           
                            <button type='submit' className='main-button me-2' disabled={isSubmitting}>{ isSubmitting ? 'Submitting...' : 'Submit' }</button>
                            <button type="button" onClick={handleCancel} className="secondary-button">Cancel</button>
                        </div>
                    </div>
                </div>
            </Form> 
        </div>
    )
}

export async function action({request}) {
    const formData = await request.formData();
    const token = getAuthToken();

    const url = API_URL + 'admin/add-quiz';
    const response = await fetch(url, {
        headers: {
            'Authorization' : 'bearer ' + token
        },
        method: 'POST',
        body: formData
    })

    if(response.status === 422 || response.status === 401){
        return response;
    }

    if(!response.ok){
        return new Response.json(JSON.stringify({message: 'Could not add quiz'}), { status: 500, headers: { 'Content-type' : 'application/json' } })
    }

    const resData = await response.json();

    return redirect('/admin/quizzes?message=' + resData.message);

}