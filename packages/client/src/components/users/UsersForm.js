import React from "react";

import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { Formik } from "formik";
import schema from "../../validation/user/userSchema";
import multiverse from "../../api/multiverse";

export default ({ setDisplayForm, refetch }) => (
  <Container>
    <h1 className="text-center mb-5">Create new user</h1>
    <Formik
      initialValues={{ username: "", password: "", admin: false }}
      onSubmit={(values, { setSubmitting }) => {
        multiverse
          .post("users", values)
          .then(() => {
            setSubmitting(false);
            setDisplayForm(false);
            refetch();
          })
          .catch(console.error);
        setSubmitting(true);
      }}
      validationSchema={schema}
    >
      {({
        values,
        handleChange,
        handleSubmit,
        handleBlur,
        touched,
        errors,
        isSubmitting
      }) => (
        <Form>
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  name="username"
                  plaintext
                  placeholder="Username"
                  onChange={handleChange}
                  value={values.username}
                  onBlur={handleBlur}
                />
              </Form.Group>
              {errors.username && touched.username ? (
                <Form.Text>
                  {errors.username.message || errors.username}
                </Form.Text>
              ) : null}
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={values.password}
                  onBlur={handleBlur}
                />
              </Form.Group>
              {errors.password && touched.password ? (
                <Form.Text>
                  {errors.password.message || errors.password}
                </Form.Text>
              ) : null}
            </Col>
          </Form.Row>
          <Form.Row>
            <Form.Group>
              <Form.Check
                name="admin"
                type="checkbox"
                label="Admin"
                className="ml-1"
                onChange={handleChange}
                checked={values.admin}
                value={values.admin}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Col className="d-flex justify-content-between">
              <Button
                variant="success"
                className="ml-1"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                Create
              </Button>
              <Button variant="danger" onClick={() => setDisplayForm(false)}>
                Go back
              </Button>
            </Col>
          </Form.Row>
        </Form>
      )}
    </Formik>
  </Container>
);
