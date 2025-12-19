import { Nav, Container, Navbar} from "react-bootstrap";
import { useState } from "react";
interface NavigationBarProps {
  onHome: () => void;
  onProjects: () => void;
  onContact: () => void;
}
export default function Navigationbar({onHome, onProjects, onContact}: NavigationBarProps) {
    const [expanded, setExpanded] = useState(false);
    return( 
        <Navbar className="navbar bg-dark navbar-expand-lg mb-3 shadow p-3 mb-5 rounded text-white" data-bs-theme="dark" variant="light" expand="lg" expanded={expanded} onToggle={() => setExpanded(!expanded)}>
            <Container>
                <Navbar.Brand className="text-white">Renz Dungo</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav  className="me-auto">
                        <Nav.Link className="text-white" href="#home" onClick={() => {
                            onHome();
                            setExpanded(!expanded);
                        }}>Home</Nav.Link>
                        <Nav.Link className="text-white" href="#projects" onClick={() => {
                            onProjects();
                            setExpanded(!expanded);
                        }}>Projects</Nav.Link>
                        <Nav.Link className="text-white" href="#contact" onClick={() => {
                            onContact();
                            setExpanded(!expanded);
                        }}>Contact</Nav.Link>
                    </Nav>
                </Navbar.Collapse>   
            </Container>
        </Navbar>
    )
}