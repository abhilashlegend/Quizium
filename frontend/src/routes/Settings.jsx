import { Form, useNavigate, redirect } from 'react-router-dom';
import { getAuthToken } from '../util/auth';

export default function Settings(props) {

    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    function handleCancel() {
        navigate('/dashboard');
    }

    return (
         <div className="container px-4 py-5 cbg h-100">
            <h2 className="pb-2 border-bottom">Settings</h2>
             <Form method="PATCH" encType='multipart/form-data'>  
             <div className="row">
                <div className='col-md-6 offset-md-3'>
                    <h3 className="text-center mb-3">Change Your Password</h3>
                    <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="password"><span aria-label='required'>* </span>Password</label>
                        <input type="password" id="password" name="password" className="form-control form-control-lg" required />
                    </div>

                        <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="confirmPassword"><span aria-label='required'>* </span>Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" className="form-control form-control-lg" />
                    </div>

                        
                    <div className="form-outline mb-4">
                        <input type="hidden" id="userId" name='userId' value={userId} />
                        <button type='submit' className='main-button me-2'>Update</button>
                        <button type="button" onClick={handleCancel} className="secondary-button">Cancel</button>
                    </div>
                </div>
             </div>
             </Form>
        </div>
    )
}

export async function action({request}) {
    const data = await request.formData();
    const userId = data.get('userId');

    const url = `http://localhost:8080/users/update-password/${userId}`;

    const token = getAuthToken();

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': 'bearer ' + token
        },
        body: data
    })

    if(response.status === 422 || response.status === 401){
        return response;
    }

    if(!response.ok){
        throw json({message: 'Could not update password'}, { status: 500 })
    }

    return redirect('/dashboard');    

}