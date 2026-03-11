import Logo  from '../assets/quiz-logo.png';

import { Navbar, Container, NavDropdown } from "react-bootstrap";

export default function Header() {
    return (
        <header className='pb-4'>
            <Navbar  expand="lg" className="shadow-sm">
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
                    <NavDropdown
                    title="Menu"
                    id="basic-nav-dropdown"
                    className="nav-menu ms-auto"
                    >
                    <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
                    <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
                    </NavDropdown>

                </Container>
            </Navbar>

        </header>
         
    )
}