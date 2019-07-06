import React, { useState } from "react";
import axios from "axios";

import { Redirect } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

export default () => {
  const [projectName, setProjectName] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return <Redirect to="/" />;

  return (
    <Container>
      <Form>
        <Form.Group>
          <Form.Label>Project Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Project Name"
            onChange={e => setProjectName(e.target.value)}
            value={projectName}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Code-Server Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
            value={password}
            disabled={!auth}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Options</Form.Label>
          <Form.Check
            type="checkbox"
            label="No Authentication"
            onChange={e => setAuth(!e.target.checked)}
            value={auth}
          />
        </Form.Group>
        <Button
          variant="primary"
          onClick={async e => {
            await axios.post("/docker/containers", {
              name: projectName
            });
            setSubmitted(true);
          }}
        >
          Create
        </Button>
      </Form>
    </Container>
  );
};
