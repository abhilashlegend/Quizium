import { Form, useNavigate, useLoaderData } from "react-router-dom";
import { getAuthToken } from "../../util/auth";
import DefaultProfilePicture  from '../../assets/307ce493-b254-4b2d-8ba4-d12c080d6651.jpg';

export default function EditUser() {
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const user = useLoaderData();
    let profileImage = null;


    console.log(user);

    function handleCancel() {
        navigate('/admin/users');
    }

    if(user?.picture){
        profileImage = `http://localhost:8080/${user?.picture}`;
    } else {
        profileImage = DefaultProfilePicture;
    }

    return (
         <div className="container px-4 py-5 cbg h-100">
            <h2 className="pb-2 border-bottom">Edit User</h2>
            <Form method="PATCH" encType='multipart/form-data'>
                <div className="row">
                    <div className='col-md-6 offset-md-3'>
                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="firstname"><span aria-label='required'>* </span>First Name</label>
                            <input type="text" id="firstname" defaultValue={user.firstName} name="firstName" className="form-control form-control-lg" required />
                        </div>

                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="lastname">Last Name</label>
                            <input type="text" id="lastname" name="lastName" defaultValue={user.lastName} className="form-control form-control-lg" />
                        </div>

                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input type="text" id="email" name="email" defaultValue={user.email} className="form-control form-control-lg"  />
                        </div>

                        <div className="form-outline mb-4">
                            <p>
                                 <img src={profileImage} width="120" />
                            </p>
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
                            <input type="hidden" id="userId" name='userId' value={user._id} />
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
    const token = getAuthToken();

    const response = await fetch('http://localhost:8080/admin/user/' + userId, {
        headers: {
        'Authorization': 'bearer ' + token
        }
    });

    if(!response.ok){
        throw JSON({
            message: 'Could not fetch user'
        }, {
            status: 500
        })
    } else {
        const resData = await response.json();
        return resData.user;
    }

}