import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import axios from "axios";

import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

export default ({ user, setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const token = localStorage.getItem("token");
  const id = localStorage.getItem("user_id");

  if (token && id) return <Redirect to="/" />;

  const signin = async () => {
    try {
      const token = await axios.post("/api/auth/login", { username, password });
      localStorage.setItem("token", token.data.token);

      const user = await axios.get(`/api/users/${token.data.id}`, {
        headers: { Authorization: `Bearer ${token.data.token}` }
      });

      localStorage.setItem("user_id", token.data.id);
      setUser(user.data);
    } catch (e) {
      if (e.response.status === 401) {
        setError("Invalid username or password");
      } else {
        console.error(e);
      }
    }
  };

  return (
    <Container fluid className="min-vh-100">
      <Row className="min-vh-100 d-flex justify-content-center align-items-center">
        <Col xs="5">
          <h1 className="text-center display-4">Multiverse</h1>
          {error ? <Alert variant="danger">{error}</Alert> : <></>}
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Group>
            <Row className="d-flex justify-content-center">
              <Col xs="2">
                <Button variant="success" onClick={signin}>
                  Login
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
