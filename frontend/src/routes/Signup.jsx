import { Link, Form, redirect, useActionData, useNavigation } from 'react-router-dom';

export default function Signup() {
    const data = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    return (
        <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div className="card shadow-2-strong" style={{ borderRadius: 1 + 'rem' }}>
                    <div className="card-body p-5">

                        <h3 className="mb-5 text-center">Sign up</h3>
                        
                        <Form method='post' encType="multipart/form-data">
                            {data && data.message && <div className="alert alert-danger">{data.message}</div>}
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="firstname"><span aria-label='required'>* </span>First Name</label>
                                <input type="text" id="firstname" name="firstName" className="form-control form-control-lg" required />
                                { data && data.data && data.data.find(err => err.path === "firstName") ? <p className='error'>{data.data.find(err => err.path === "firstName").msg}</p> : null }
                            </div>

                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="lastname">Last Name</label>
                                <input type="text" id="lastname" name="lastName" className="form-control form-control-lg" />
                            </div>

                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="picture">Profile Picture</label>
                                <input type="file" name="picture" id="picture"  />
                            </div>

                            <div data-mdb-input-init className="form-outline mb-4">
                                <label className="form-label" htmlFor="email"><span aria-label='required'>* </span> Email</label>
                                <input type="email" id="email" name="email" className="form-control form-control-lg" required />
                               { data && data.data && data.data.find(err => err.path === "email") ? <p className='error'>{data.data.find(err => err.path === "email").msg}</p> : null }
                            </div>

                            <div data-mdb-input-init className="form-outline mb-4">
                                <label className="form-label" htmlFor="password"><span aria-label='required'>* </span> Password</label>
                                <input type="password" id="password" name="password" className="form-control form-control-lg" required />
                                { data && data.data && data.data.find(err => err.path === "password") ? <p className='error'>{data.data.find(err => err.path === "password").msg}</p> : null }
                            </div>

                            <div data-mdb-input-init className="form-outline mb-4">
                                <label className="form-label" htmlFor="confirmPassword"><span aria-label='required'>* </span> Confirm Password</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" className="form-control form-control-lg" required />
                                { data && data.data && data.data.find(err => err.path === "confirmPassword") ? <p className='error'>{data.data.find(err => err.path === "confirmPassword").msg}</p> : null }
                            </div>

                            <button  className="main-button me-2" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                            <Link className='secondary-button' to='/'>Cancel</Link>
                        </Form>
                    </div>
                    </div>
                </div>
                </div>
            </div>
    )
}

export async function action({request}) {
    const formData = await request.formData();
    
    let response;
    try {
        response = await fetch('http://localhost:8080/auth/signup', {
            method: 'POST',
            body: formData
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Network error: Could not connect to the server.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    if(response.status === 422 || response.status === 401){
        return response;
    }

    if(!response.ok){
        throw new Response(JSON.stringify({message: 'Could not signup user' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const resData = await response.json();

    return redirect('/');
}