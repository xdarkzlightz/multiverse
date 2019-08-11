import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import { Redirect } from "react-router-dom";

import { Formik } from "formik";

import multiverse from "../../api/multiverse";

import schema from "../../validation/changePassword/passwordChangeSchema";

export default () => {
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState(false);

  if (redirect) return <Redirect to="/login" />;

  return (
    <Container>
      <h5 className="text-center">Change Password</h5>
      <Formik
        initialValues={{
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        }}
        onSubmit={({ oldPassword, newPassword }, { setSubmitting }) => {
          const id = localStorage.getItem("user_id");

          multiverse
            .patch(`users/${id}/updatePassword`, {
              oldPassword,
              newPassword
            })
            .then(() => {
              localStorage.clear();
              setSubmitting(false);
              setRedirect(true);
            })
            .catch(e =>
              e.response.status === 400 &&
              e.response.data === "Invalid password"
                ? setError("Wrong password")
                : console.error
            );
          setSubmitting(true);
        }}
        validationSchema={schema}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur,
          errors,
          touched
        }) => (
          <Form>
            <Form.Group>
              <Form.Label>Old password</Form.Label>
              <Form.Control
                name="oldPassword"
                type="password"
                placeholder="Password"
                value={values.oldPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.oldPassword && touched.oldPassword ? (
                <Form.Text>
                  {errors.oldPassword.message || errors.oldPassword}
                </Form.Text>
              ) : null}
            </Form.Group>
            <Form.Group>
              <Form.Label>New password</Form.Label>
              <Form.Control
                name="newPassword"
                type="password"
                placeholder="Password"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.newPassword && touched.newPassword ? (
                <Form.Text>
                  {errors.newPassword.message || errors.newPassword}
                </Form.Text>
              ) : null}
            </Form.Group>

            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.confirmPassword && touched.confirmPassword ? (
                <Form.Text>
                  {errors.confirmPassword.message || errors.confirmPassword}
                </Form.Text>
              ) : null}
            </Form.Group>
            {error ? <Alert variant="danger">{error}</Alert> : null}
            <Row className="d-flex justify-content-center">
              <Col xs="2">
                <Button variant="success" onClick={handleSubmit}>
                  Change
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </Container>
  );
};
