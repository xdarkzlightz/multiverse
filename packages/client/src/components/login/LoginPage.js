import React from "react";
import { Redirect } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import LoginForm from "./loginForm";

export default () => {
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("user_id");

  if (token && id) return <Redirect to="/" />;

  return (
    <Container fluid className="min-vh-100">
      <Row className="min-vh-100 d-flex justify-content-center align-items-center">
        <LoginForm />
      </Row>
    </Container>
  );
};
