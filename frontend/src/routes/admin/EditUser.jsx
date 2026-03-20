import { Form, useNavigate } from "react-router-dom";

export default function EditUser() {
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    function handleCancel() {
        navigate('/admin/users');
    }

    return (
         <div className="container px-4 py-5 cbg h-100">
            <h2 className="pb-2 border-bottom">Edit User</h2>
            <Form method="PATCH" encType='multipart/form-data'>
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

export async function loader({request, params}) {

    const userId = params.id;

    const response = await fetch('http://localhost:8080/admin/user/' + userId);

}