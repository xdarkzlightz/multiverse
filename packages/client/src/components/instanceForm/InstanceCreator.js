import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import InstanceField from "./InstanceField";
import CreateButton from "./CreateButton";

import Joi from "joi-browser";
import * as validators from "../../validation/validators";

const defaultOptions = {
  name: "",
  password: "",
  path: "",
  port: "8443:8443",
  auth: true,
  http: false,
  volumes: [],
  ports: [],
  curVol: "",
  curPort: ""
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
    <Container>
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
              placeholder="Absolute Path"
              onChange={val => setOption("path", val)}
              validator={val => validate("path", val)}
            />
          </Col>
          <Col xs={12} md={6}>
            <InstanceField
              type="password"
              label="Password"
              placeholder="Password"
              disabled={!options.auth}
              onChange={val => setOption("password", val)}
              validator={val =>
                options.auth ? validate("password", val) : setError("")
              }
            />
          </Col>
          <Col xs={12} md={6}>
            <InstanceField
              label={`Additional Ports - ${options.ports.join(", ")}`}
              placeholder="host:container"
              onChange={val => setOption("curPort", val)}
              onEnter={() =>
                setOption("ports", [...options.ports, options.curPort])
              }
              validator={val => (!val ? setError("") : validate("port", val))}
            />
          </Col>
          <Col xs={12} md={6}>
            <InstanceField
              label="Port"
              placeholder="host:container"
              def={options.port}
              onChange={val => setOption("port", val)}
              validator={val => validate("port", val)}
            />
          </Col>
          <Col xs={12} md={6}>
            <InstanceField
              label={`Additional Volumes - ${options.volumes.join(", ")}`}
              placeholder="host:container"
              onChange={val => setOption("curVol", val)}
              onEnter={() =>
                setOption("volumes", [...options.volumes, options.curVol])
              }
              validator={val => (!val ? setError("") : validate("volume", val))}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Options</Form.Label>
              <Form.Check
                type="checkbox"
                label="Authentication"
                onChange={e => {
                  setOption("auth", e.target.checked);
                  setError("");
                }}
                value={options.auth}
                checked={options.auth}
              />
              <Form.Check
                type="checkbox"
                label="Allow http"
                onChange={e => setOption("http", e.target.checked)}
                value={options.http}
                checked={options.http}
              />
            </Form.Group>
          </Col>
          <Col>{error ? <Alert variant="danger">{error}</Alert> : <></>}</Col>
        </Row>
        <Row>
          <Col>
            <CreateButton data={options} onError={setError} />
          </Col>
        </Row>
      </Form>
    </Container>
  );
};
