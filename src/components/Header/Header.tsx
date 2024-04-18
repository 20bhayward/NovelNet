import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../SearchBar/SearchBar';

const Header: React.FC = () => {
  const isLoggedIn = false; // Replace with your actual authentication logic
  const navigate = useNavigate();

  const handleAdvancedSearch = () => {
    navigate('/search');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container className="d-flex align-items-center">
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          Lore Library
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="d-flex align-items-center">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/bookmarks">
              Bookmarks
            </Nav.Link>
            <Button variant="outline-light" onClick={handleAdvancedSearch} className="ml-2">
              Advanced Search
            </Button>
          </Nav>
          <SearchBar />
          <Nav>
            {isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/profile" className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
                </Nav.Link>
                <Nav.Link as={Link} to="/logout" className="d-flex align-items-center">
                  Logout
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/login" className="d-flex align-items-center">
                Login/Register
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;