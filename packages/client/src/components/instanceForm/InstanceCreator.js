import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import InstanceField from "./InstanceField";
import CreateButton from "./CreateButton";
import { UserConsumer } from "../../context/UserContext";
import Header from "../Header";

import Joi from "joi-browser";
import * as validators from "../../validation/validators";

const defaultOptions = {
  name: "",
  path: ""
};

export default () => {
  const [options, setOptions] = useState(defaultOptions);
  const setOption = (opt, val) => setOptions({ ...options, [opt]: val });
  const [error, setError] = useState("");

  const validate = (validator, val) => {
    try {
      Joi.validate(val, validators[validator]);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <UserConsumer>{data => <Header {...data} />}</UserConsumer>
      <Container>
        <h1 className="text-center mb-5">Create new project</h1>
        <Form>
          <Row>
            <Col xs={12} md={6}>
              <InstanceField
                label="Project Name"
                placeholder="Project Name"
                onChange={val => setOption("name", val)}
                validator={val => validate("name", val)}
              />
            </Col>
            <Col xs={12} md={6}>
              <InstanceField
                label={`Project Path - ${options.path +
                  options.name.replace(/\s/g, "-")}`}
                placeholder="Path/Volume"
                onChange={val => setOption("path", val)}
                validator={val => validate("path", val)}
              />
            </Col>
          </Row>
          <Row>
            <Col>{error ? <Alert variant="danger">{error}</Alert> : <></>}</Col>
          </Row>
          <Row>
            <Col>
              <CreateButton data={options} onError={setError} />
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};
