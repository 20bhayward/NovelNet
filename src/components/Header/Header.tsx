import React from 'react';
import { Navbar, Nav, Form, FormControl, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const isLoggedIn = false; // Replace with your actual authentication logic

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src="src/components/Header/Logo.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          Lore Library
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/series">
              Series
            </Nav.Link>
            <Nav.Link as={Link} to="/bookmarks">
              Bookmarks
            </Nav.Link>
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form>
          <Nav>
            {isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>
                <Nav.Link as={Link} to="/logout">
                  Logout
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">
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