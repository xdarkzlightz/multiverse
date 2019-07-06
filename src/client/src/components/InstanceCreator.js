import React, { useState } from "react";
import axios from "axios";

import { Redirect } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

export default () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [path, setPath] = useState("");
  const [port, setPort] = useState("8443");
  const [auth, setAuth] = useState(true);
  const [http, setHttp] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
            onChange={e => {
              setName(e.target.value);
            }}
            value={name}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
            value={password}
            disabled={!auth}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Port</Form.Label>
          <Form.Control
            type="text"
            onChange={e => setPort(e.target.value)}
            value={port}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Project Path</Form.Label>
          <Form.Control
            type="text"
            onChange={e => setPath(e.target.value)}
            value={path}
          />
          <Form.Text className="text-muted">{path + name}</Form.Text>
        </Form.Group>
        <Form.Group>
          <Form.Label>Options</Form.Label>
          <Form.Check
            type="checkbox"
            label="No Authentication"
            onChange={e => setAuth(!e.target.checked)}
            value={auth}
          />
          <Form.Check
            type="checkbox"
            label="Allow http"
            onChange={e => setHttp(!e.target.checked)}
            value={http}
          />
        </Form.Group>
        <Button
          variant="primary"
          onClick={async e => {
            try {
              if (!name) {
                return setError("You must have a project name.");
              } else if (!password && auth) {
                return setError("You must have a password");
              }
              await axios.post("/docker/containers", {
                name: name.replace(/\s/g, "_"),
                http,
                password,
                port,
                auth,
                path
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
