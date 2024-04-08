import React, { useState, useRef, useEffect } from 'react';
import { Navbar, Nav, Form, FormControl, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header: React.FC = () => {
  const isLoggedIn = false; // Replace with your actual authentication logic
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const searchFormRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSearchIconClick = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      toggleSearchExpanded();
    }
  };

  const toggleSearchExpanded = () => {
    setSearchExpanded(!searchExpanded);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (searchFormRef.current && !searchFormRef.current.contains(event.target as Node)) {
      setSearchExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container className="d-flex align-items-center">
        <Navbar.Brand as={Link} to="/" onClick={toggleSearchExpanded} className="d-flex align-items-center">
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
          </Nav>
          <div ref={searchFormRef} className={`search-form ${searchExpanded ? 'expanded' : ''}`}>
            <Form inline onSubmit={handleSearch} className="d-flex align-items-center">
              <div className="search-input-container d-flex align-items-center">
                <FontAwesomeIcon
                  icon={faSearch}
                  className={`search-icon ${searchExpanded ? 'expanded' : ''}`}
                  onClick={handleSearchIconClick}
                />
                <FormControl
                  type="text"
                  placeholder="Search"
                  className={`search-input ${searchExpanded ? 'expanded' : ''}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={toggleSearchExpanded}
                />
              </div>
            </Form>
          </div>
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