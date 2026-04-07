import { useNavigate, Form, useNavigation, redirect } from "react-router-dom";
import { getAuthToken } from "../../util/auth";
import { API_URL } from "../../config";

export default function NewUser(props){

    const navigate = useNavigate();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    function handleCancel() {
        navigate('/admin/users')
    }

    return (
        <div className="container px-4 py-5 cbg h-100">
            <h2 className="pb-2 border-bottom">New User</h2>
            <Form method="POST" encType='multipart/form-data'>
                <div className="row">
                    <div className='col-md-6 offset-md-3'>
                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="firstname"><span aria-label='required'>* </span>First Name</label>
                            <input type="text" id="firstname" name="firstName" className="form-control form-control-lg" required />
                        </div>

                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="lastname">Last Name</label>
                            <input type="text" id="lastname" name="lastName" className="form-control form-control-lg" />
                        </div>

                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input type="text" id="email" name="email" className="form-control form-control-lg"  />
                        </div>

                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="picture">Profile Picture</label> <br />
                            <input type="file" name="picture" id="picture"  />
                        </div>

                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="password"><span aria-label='required'>* </span>Password</label>
                            <input type="password" id="password" name="password" className="form-control form-control-lg" />
                        </div>

                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" className="form-control form-control-lg" />
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

    const url = API_URL + 'admin/add-user';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization' : 'bearer ' + token
        },
        body: formData
    });

    if(response.status === 422 || response.status === 401){
        return response;
    }

    if(!response.ok){
        return new Response(JSON.stringify({message: 'Could not add user'}), { status: 500, headers: { 'Content-Type': 'application/json' } })
    }

    const resData = response.json();

    return redirect("/admin/users?message=" + resData.message);

}