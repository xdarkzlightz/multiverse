import React, { useState } from "react";

import { Link, Redirect } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

export default ({ user }) => {
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
        <Nav className="ml-auto">
          <Navbar.Text className="mr-5">
            Logged in as {user.username}
          </Navbar.Text>
          <Nav.Link as={Link} to="/users">
            Manage Users
          </Nav.Link>
          <Nav.Link as={Link} to="/projects">
            Manage Projects
          </Nav.Link>
          <Nav.Link>Settings</Nav.Link>
          <Nav.Link onClick={logout}>Logout</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
