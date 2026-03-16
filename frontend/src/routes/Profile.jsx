import { Form, useNavigate, redirect } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAuthToken } from '../util/auth';
import DefaultProfilePicture  from '../assets/307ce493-b254-4b2d-8ba4-d12c080d6651.jpg';

export default function Profile(props) {

    const [profileData, setProfileData] = useState(null);
     const token = localStorage.getItem('token');
     const userId = localStorage.getItem('userId');

     const navigate = useNavigate();
     let profileImage = null;

     function handleCancel() {
        navigate('/dashboard');
     }



    useEffect(() => {
       fetch('http://localhost:8080/users/user-profile/' + userId, {
        headers: {
            Authorization: 'Bearer ' + token
        }
       }).then(result => {
        return result.json();
       }).then(data => {
            setProfileData(data.user);
       }).catch(err => {
        console.log(err);
       })
    }, []);

    if(profileData?.picture){
        profileImage = `http://localhost:8080/${profileData?.picture}`;
    } else {
        profileImage = DefaultProfilePicture;
    }
    
    return (
        <div className="container px-4 py-5 cbg h-100">
            <h2 className="pb-2 border-bottom">Profile</h2>
             <Form method="PATCH" encType='multipart/form-data'>  
             <div className="row">
                 
                <div className='col-md-4 col-lg-6'>
                    
                    <img src={profileImage} width="120" />
                     <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="picture">Profile Picture</label> <br />
                        <input type="file" name="picture" id="picture"  />
                    </div>
                </div>
                <div className="col-md-8 col-lg-6 col-xl-5">
                        
                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="firstname"><span aria-label='required'>* </span>First Name</label>
                            <input type="text" id="firstname" name="firstName" className="form-control form-control-lg" defaultValue={profileData?.firstName} required />
                        </div>

                         <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="lastname">Last Name</label>
                            <input type="text" id="lastname" name="lastName" className="form-control form-control-lg" defaultValue={profileData?.lastName} />
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

   /*  const profileData = {
        firstName: data.get('firstName'),
        lastName: data.get('lastName'),
        picture: data.get('picture')
    }; */

    let url = 'http://localhost:8080/users/user-profile/' + userId;

    const token = getAuthToken();

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': 'bearer ' + token
        },
        body: data
    })

    if(response.status === 422){
        return response;
    }

    if(!response.ok){
         throw new Response(JSON.stringify({message: 'Could not update user profile' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    return redirect("/dashboard");
}