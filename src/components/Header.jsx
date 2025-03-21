import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { FaSignInAlt, FaSignOutAlt, FaUser, FaUserInjured, FaNotesMedical, FaChartBar } from 'react-icons/fa';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <Navbar style={{ backgroundColor: '#4D4D4D' }} variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard">
          FisiMaster
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link as={Link} to="/dashboard">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/pacientes">
                  <FaUserInjured className="me-1" /> Pacientes
                </Nav.Link>
                <Nav.Link as={Link} to="/procedimentos">
                  <FaNotesMedical className="me-1" /> Procedimentos
                </Nav.Link>
                <Nav.Link as={Link} to="/relatorios">
                  <FaChartBar className="me-1" /> Relatórios
                </Nav.Link>
                <Button variant="outline-light" onClick={onLogout}>
                  <FaSignOutAlt className="me-1" /> Sair
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  <FaSignInAlt className="me-1" /> Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <FaUser className="me-1" /> Cadastro
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;