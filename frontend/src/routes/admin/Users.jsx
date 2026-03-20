import { Button, Table } from 'react-bootstrap';
import { getAuthToken } from '../../util/auth';
import { useLoaderData, Await, Link } from 'react-router-dom';
import { Suspense } from 'react';
import { Pencil, Trash2Fill } from 'react-bootstrap-icons';

export default function Users() {
    const { users } = useLoaderData();
    
    return (
        <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading users...</p>}>
            <div className="container px-4 py-5 cbg" id="users">
                <h2 className="pb-2 border-bottom">Users</h2>
                <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
                    <Await resolve={users}>
                        {(resolvedUsers) => (
                            <Table bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resolvedUsers.map((user, index) => (
                                        <tr key={user._id || index} className='align-middle'>
                                            <td>{index + 1}</td>
                                            <td>{user.firstName}</td>
                                            <td>{user.lastName}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <Link to={`/admin/edit-user/${user._id}`} className='btn btn-success action-btn me-2'><Pencil size={14} className='me-1 action-icon' /> Edit</Link>
                                                <Button className='btn btn-danger action-btn'><Trash2Fill size={14} className='me-1 action-icon' /> Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Await>
                </div>
          </div>
        </Suspense>
    )
}

async function loadUsers() {

    const token = getAuthToken();

    const response = await fetch('http://localhost:8080/admin/users', {
        headers: {
            'Authorization': 'bearer ' + token
        }
    });

    if(!response.ok) {
        throw new Response(JSON.stringify({message: 'Could not fetch users.'}), { status: 500, headers: { 'Content-Type': 'application/json' }});
    } else {
        const resData = await response.json();
        return  resData.users;
    }
}

export function loader() {
    return {
        users: loadUsers()
    };
}