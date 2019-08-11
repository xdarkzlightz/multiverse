import React, { useState } from "react";

import { Link, Redirect } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default ({ user, search, setSearch, searchbar }) => {
  const [redirect, setRedirect] = useState(false);
  if (redirect) return <Redirect to="/login" />;

  const logout = () => {
    localStorage.clear();
    setRedirect(true);
  };

  return (
    <Navbar
      collapseOnSelect
      expand="sm"
      bg="dark"
      variant="dark"
      className="mb-3"
    >
      <Navbar.Brand as={Link} to="/projects">
        Multiverse
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        {searchbar ? (
          <Form inline>
            <Form.Control
              plaintext
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </Form>
        ) : null}

        <Nav className="ml-auto">
          {user.admin ? (
            <Nav.Link as={Link} to="/users">
              Manage Users
            </Nav.Link>
          ) : (
            undefined
          )}
          <Nav.Link as={Link} to="/projects">
            Manage Projects
          </Nav.Link>
          <NavDropdown
            title={
              <span>
                {user.username}
                <FontAwesomeIcon
                  icon={faUser}
                  size="sm"
                  className="clickable ml-1"
                />
              </span>
            }
            alignRight
          >
            <NavDropdown.Item as={Link} to="/settings">
              Settings
            </NavDropdown.Item>
            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
