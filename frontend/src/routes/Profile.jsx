import { Form } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function(props) {

    const [profileData, setProfileData] = useState(null);
     const token = localStorage.getItem('token');
     const userId = localStorage.getItem('userId');



    useEffect(() => {
       fetch('http://localhost:8080/users/user-profile/' + userId, {
        headers: {
            Authorization: 'Bearer ' + token
        }
       }).then(result => {
        return result.json();
       }).then(data => {
        console.log(data);
            setProfileData(data.user);
       }).catch(err => {
        console.log(err);
       })
    }, [])
    return (
        <div className="container px-4 py-5 cbg h-100">
            <h2 className="pb-2 border-bottom">Profile</h2>
             <Form method="PATCH">  
             <div className="row">
                 
                <div className='col-md-4 col-lg-6'>
                    <img src={`http://localhost:8080/${profileData?.picture}`} width="120" />
                     <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="picture">Profile Picture</label> <br />
                        <input type="file" defaultValue={profileData?.picture} name="picture" id="picture"  />
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

                           

                
                </div>  
             </div>
              </Form>
        </div>
    )
}