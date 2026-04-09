import { getAuthToken } from '../../util/auth';
import { API_URL } from '../../config';
import { useNavigation, useNavigate, Form, useLoaderData, redirect } from 'react-router-dom';


export default function EditQuiz() {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';
    const navigate = useNavigate();
    const quiz = useLoaderData();


    function handleCancel() {
        navigate('/admin/quizzes');
    }
    return (
        <div className="container px-4 py-5 cbg h-100">
            <h2 className="pb-2 border-bottom">Edit Quiz</h2>
            <Form method="PATCH">
                <div className="row">
                    <div className='col-md-6 offset-md-3'>
                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="title"><span aria-label='required'>* </span>Title</label>
                            <input type="text" id="title" name="title" defaultValue={quiz.title} className="form-control form-control-lg" required />
                        </div>
                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="title">Description</label>
                            <textarea id="description" name="description" defaultValue={quiz.description} className="form-control form-control-lg" rows="5"></textarea>
                        </div>

                        <div className="form-outline mb-4">
                            <input type="hidden" name="quizId" id='quizId' value={quiz._id} />
                            <button type='submit' className='main-button me-2' disabled={isSubmitting}>{ isSubmitting ? 'Submitting...' : 'Submit' }</button>
                            <button type="button" onClick={handleCancel} className="secondary-button">Cancel</button>
                        </div>
                    </div>
                </div>
            </Form> 
        </div>
    )
}

export async function loader({request, params}) {
    const quizId = params.id;
    const token = getAuthToken();

    const url = API_URL + 'admin/quiz/' + quizId;

    const response = await fetch(url, {
        headers: {
            'Authorization' : 'bearer ' + token
        }
    });


    if(!response.ok){
        throw new Response(JSON.stringify({ message: 'Could not fetch quiz' }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    } else {
        const resData = await response.json();
        return resData.quiz;
    }
}

export async function action({request}) {
    const formData = await request.formData();
    const quizId = formData.get('quizId');
    const token = getAuthToken();
    const url = API_URL + 'admin/quiz/' + quizId;

    const quizData = {
        title: formData.get('title'),
        description: formData.get('description')
    };

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization' : 'bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(quizData)
    });

    if(response.status === 422){
        return response;
    }

    if(!response.ok){
        throw new Response(JSON.stringify({ message: 'Could not update quiz' }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }

    const resData = await response.json();

    return redirect("/admin/quizzes?message=" + resData.message);

}