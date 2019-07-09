import React from "react";

import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

export default () => {
  return (
    <Navbar bg="dark" variant="dark" className="mb-3">
      <Navbar.Brand as={Link} to="/">
        Multiverse
      </Navbar.Brand>
      <Nav className="ml-auto">
        <Nav.Link as={Link} to="/create">
          Add New Instance
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};
