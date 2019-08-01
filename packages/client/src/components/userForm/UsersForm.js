import React, { useState } from "react";
import axios from "axios";

import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { Redirect } from "react-router-dom";

import Header from "../Header";
import { UserConsumer } from "../../context/UserContext";

export default () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const createUser = (username, password, admin) => {
    const token = localStorage.getItem("token");

    axios
      .post(
        "/api/users",
        { username, password, admin },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then(() => setRedirect(true));
  };

  if (redirect) return <Redirect to="/users" />;

  return (
    <>
      <UserConsumer>{data => <Header {...data} />}</UserConsumer>
      <Container>
        <h1 className="text-center mb-5">Create new user</h1>
        <Form>
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  plaintext
                  placeholder="Username"
                  onChange={e => setUsername(e.target.value)}
                  value={username}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={e => setPassword(e.target.value)}
                  value={password}
                />
              </Form.Group>
            </Col>
          </Form.Row>
          <Form.Row>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Admin"
                className="ml-1"
                onChange={e => setAdmin(e.target.checked)}
                checked={admin}
                value={admin}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Button
              variant="success"
              className="ml-1"
              onClick={() => createUser(username, password, admin)}
            >
              Create
            </Button>
          </Form.Row>
        </Form>
      </Container>
    </>
  );
};
