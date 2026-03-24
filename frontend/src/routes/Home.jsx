import { Link, Form, redirect, useActionData, useLoaderData, useNavigate, useNavigation } from 'react-router-dom';

export default function Home() {
    const data = useActionData();
    const loaderData = useLoaderData();
    const navigate = useNavigation();
    const isSubmitting = navigate.state === 'submitting';

    return (
       
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div className="card shadow-2-strong" style={{ borderRadius: 1 + 'rem' }}>
                    <div className="card-body p-5">

                        <h3 className="mb-5 text-center">Sign in</h3>
                        { loaderData && loaderData.message && <div className='alert alert-danger'> {loaderData.message}</div> }
                        { data && data.message && <div className='alert alert-danger'> {data.message}</div> }
                        <Form method="post">
                            <div data-mdb-input-init className="form-outline mb-4">
                                <label className="form-label" htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" className="form-control form-control-lg" required />
                                { data && data.data && data.data.find(err => err.path === "email") ? <p className='error'>{data.data.find(err => err.path === "email").msg}</p> : null }
                            </div>

                            <div data-mdb-input-init className="form-outline mb-4">
                                <label className="form-label" htmlFor="password">Password</label>
                                <input type="password" id="password" name="password" className="form-control form-control-lg" required />
                                { data && data.data && data.data.find(err => err.path === "password") ? <p className='error'>{data.data.find(err => err.path === "password").msg}</p> : null }
                            </div>

                            <button  className="main-button me-2" type="submit" disabled={isSubmitting}>{ isSubmitting ? 'Logging in...' : 'Login' }</button>
                            <Link className='secondary-button' to='/signup'>Signup</Link>
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

  const userData = {
    email: formData.get('email'),
    password: formData.get('password')
  }

  let response;
  try {
        response = await fetch('http://localhost:8080/auth/signin', {
        headers: {
            'Content-Type':'application/json'
        },
        method: 'POST',
        body: JSON.stringify(userData)
    })
  } catch (error) {
    console.log("Error fetching data: " + error);
    return new Response(JSON.stringify({ message: 'Network error could not connect to the server' }), {status: 500, headers: { 'Content-Type': 'application/json'}});
  }

  if(response.status === 422 || response.status === 401){
    return response;
  }

  if(!response.ok){
    return new Response(JSON.stringify({message: 'Could not signin user'}), { status: 500, headers: {'Content-Type': 'application/json' }})
  }

  const resData = await response.json();
  const token = resData.token;

  localStorage.setItem('token', token);
  localStorage.setItem('refreshToken', resData.refreshToken);
  localStorage.setItem('userId', resData.userId);
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  localStorage.setItem('expiration', expiration.toISOString());
  return redirect("/dashboard");

}
