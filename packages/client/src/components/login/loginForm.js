import React, { useState } from "react";

import axios from "axios";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { Redirect } from "react-router-dom";

import { Formik } from "formik";

export default () => {
  const [error, setError] = useState(false);
  const [redirect, setRedirect] = useState(false);

  if (redirect) return <Redirect to="/" />;

  return (
    <Col xs="12" lg="5">
      <h1 className="text-center display-4">Multiverse</h1>
      {error ? <Alert variant="danger">{error}</Alert> : <></>}
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const {
              data: { token, id }
            } = await axios.post("/api/auth/login", values);
            localStorage.setItem("token", token);
            localStorage.setItem("user_id", id);
            setRedirect(true);
          } catch (e) {
            e.response.status === 401
              ? setError("Invalid username or password")
              : console.error(e);
          }
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <Form>
            <Form.Row>
              <Col>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    name="username"
                    type="text"
                    placeholder="Enter username"
                    value={values.username}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Form.Row>

            <Form.Row>
              <Col className="d-flex justify-content-center">
                <Button variant="success" onClick={handleSubmit}>
                  Login
                </Button>
              </Col>
            </Form.Row>
          </Form>
        )}
      </Formik>
    </Col>
  );
};
