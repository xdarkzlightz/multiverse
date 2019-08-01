import React, { useState } from "react";

import axios from "axios";

import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { Redirect } from "react-router-dom";

import { UserConsumer } from "../../context/UserContext";
import Header from "../Header";

import Joi from "joi-browser";
import * as validators from "../../validation/validators";
import schema from "../../validation/schema";

export default () => {
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState(false);

  const validate = (validator, val) => {
    try {
      Joi.validate(val, validators[validator]);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };

  const createProject = () => {
    const token = localStorage.getItem("token");

    try {
      Joi.validate({ name, path }, schema);
    } catch (e) {
      return setError(e.message);
    }

    axios
      .post(
        "/api/containers",
        { name, path },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then(() => setRedirect(true))
      .catch(e => setError(e.message));
  };

  if (redirect) return <Redirect to="/projects" />;

  return (
    <>
      <UserConsumer>{data => <Header {...data} />}</UserConsumer>
      <Container>
        <h1 className="text-center mb-5">Create new project</h1>
        <Form>
          <Form.Row>
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label>Project Name</Form.Label>
                <Form.Control
                  plaintext
                  placeholder="Project Name"
                  onChange={e => {
                    validate("name", e.target.value);
                    setName(e.target.value);
                  }}
                  value={name}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label>Project Path or volume</Form.Label>
                <Form.Control
                  plaintext
                  placeholder="Path or volume"
                  onChange={e => {
                    validate("path", e.target.value);
                    setPath(e.target.value);
                  }}
                  value={path}
                />
              </Form.Group>
            </Col>
          </Form.Row>
          <Form.Row>
            <Col>{error ? <Alert variant="danger">{error}</Alert> : <></>}</Col>
          </Form.Row>
          <Form.Row>
            <Col>
              <Button variant="success" onClick={createProject}>
                Create
              </Button>
            </Col>
          </Form.Row>
        </Form>
      </Container>
    </>
  );
};
