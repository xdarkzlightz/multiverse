import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import InstanceField from "./InstanceField";
import CreateButton from "./CreateButton";

const defaultOptions = {
  name: "",
  password: "",
  path: "",
  port: "8443",
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

  return (
    <Container>
      {error ? <Alert variant="danger">{error}</Alert> : <></>}
      <Form>
        <Row>
          <Col xs={12} md={6}>
            <InstanceField
              label="Project Name"
              placeholder="Project Name"
              onChange={val => setOption("name", val)}
            />
          </Col>
          <Col xs={12} md={6}>
            <InstanceField
              label={`Project Path - ${options.path +
                options.name.replace(/\s/g, "-")}`}
              placeholder="Absolute Path"
              onChange={val => setOption("path", val)}
            />
          </Col>
          <Col xs={12} md={6}>
            <InstanceField
              type="password"
              label="Password"
              placeholder="Password"
              disabled={!options.auth}
              onChange={val => setOption("password", val)}
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
            />
          </Col>
          <Col xs={12} md={6}>
            <InstanceField
              label="Port"
              placeholder={options.port}
              onChange={val => setOption("port", val)}
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
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Options</Form.Label>
              <Form.Check
                type="checkbox"
                label="No Authentication"
                onChange={val => setOption("auth", !val)}
                value={options.auth}
              />
              <Form.Check
                type="checkbox"
                label="Allow http"
                onChange={val => setOption("http", !val)}
                value={options.val}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <CreateButton data={options} onError={err => setError(err)} />
          </Col>
        </Row>
      </Form>
    </Container>
  );
};
