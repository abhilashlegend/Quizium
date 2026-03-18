import { Table } from 'react-bootstrap';

export default function Users() {
    return (
        <div className="container px-4 py-5 cbg" id="users">
                <h2 className="pb-2 border-bottom">Users</h2>
                <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
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
                            <tr>
                                <td>1</td>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
          </div>
    )
}