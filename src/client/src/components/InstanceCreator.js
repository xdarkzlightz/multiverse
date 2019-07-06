import React, { useState } from "react";
import axios from "axios";

import { Redirect } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

export default () => {
  const [projectName, setProjectName] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (submitted) return <Redirect to="/" />;

  return (
    <Container>
      {error ? <Alert variant="danger">{error}</Alert> : <></>}
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
            try {
              await axios.post("/docker/containers", {
                name: projectName.replace(/\s/g, "_")
              });
              setSubmitted(true);
            } catch (e) {
              console.log(e.response);
              setError(e.response.data.message);
            }
          }}
        >
          Create
        </Button>
      </Form>
    </Container>
  );
};
