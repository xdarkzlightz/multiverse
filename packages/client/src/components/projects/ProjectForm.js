import React from "react";

import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { Formik } from "formik";
import multiverse from "../../api/multiverse";
import schema from "../../validation/project/projectSchema";

export default ({ setDisplayForm, refetch }) => (
  <Container>
    <h1 className="text-center mb-5">Create new project</h1>
    <Formik
      initialValues={{ name: "", path: "" }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        multiverse
          .post("containers", values)
          .then(() => {
            setSubmitting(false);
            setDisplayForm(false);
            refetch();
          })
          .catch(console.error);
        setSubmitting(true);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting
      }) => (
        <Form>
          <Form.Row>
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label>Project Name</Form.Label>
                <Form.Control
                  name="name"
                  plaintext
                  placeholder="Project Name"
                  onChange={handleChange}
                  value={values.name}
                  onBlur={handleBlur}
                />
                {errors.name && touched.name ? (
                  <Form.Text>{errors.name.message || errors.name}</Form.Text>
                ) : null}
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label>Project Path or volume</Form.Label>
                <Form.Control
                  name="path"
                  plaintext
                  placeholder="Path or volume"
                  onChange={handleChange}
                  value={values.path}
                  onBlur={handleBlur}
                />
                {errors.path && touched.path ? (
                  <Form.Text>{errors.path.message || errors.path}</Form.Text>
                ) : null}
              </Form.Group>
            </Col>
          </Form.Row>
          <Form.Row>
            <Col className="d-flex justify-content-between">
              <Button
                variant="success"
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
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
