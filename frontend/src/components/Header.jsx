import Logo  from '../assets/quiz-logo.png';
import { Form, useRouteLoaderData, Link } from 'react-router-dom';

import { Navbar, Container, NavDropdown } from "react-bootstrap";

export default function Header() {

    const hasToken = useRouteLoaderData('root');

    return (
        <header className='pb-4'>
            <Navbar  expand="lg">
                <Container className="position-relative">

                    {/* Center Logo */}
                    <Navbar.Brand 
                    href="/" 
                    className="position-absolute start-50 translate-middle-x"
                    >
                       
                    <img src={Logo} alt="Quiz App logo"  height="40" />
                     <h1>Quizium</h1>
                    </Navbar.Brand>

                    {/* Right Dropdown */}
                    { hasToken && <NavDropdown
                    title="Menu"
                    id="basic-nav-dropdown"
                    className="nav-menu ms-auto"
                    >
                    <NavDropdown.Item to="/profile" as={Link}>Profile</NavDropdown.Item>
                    <NavDropdown.Item to="/settings" as={Link}>Settings</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <Form action="/logout" method='POST'>
                        <NavDropdown.Item role='button' as='button'>Logout</NavDropdown.Item>
                    </Form>
                    </NavDropdown> }
                    

                </Container>
            </Navbar>

        </header>
         
    )
}