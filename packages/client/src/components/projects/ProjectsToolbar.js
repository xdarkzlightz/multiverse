import React from "react";

import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import Col from "react-bootstrap/Col";

export default () => {
  return (
    <Form>
      <Form.Row className="d-flex justify-content-center">
        <Col xs="2" />
        <Col xs={5}>
          <Form.Control plaintext placeholder="Search projects" />
        </Col>
        <Col xs="3">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Sort by
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>a-z</Dropdown.Item>
              <Dropdown.Item>z-a</Dropdown.Item>
              <Dropdown.Item>Created by</Dropdown.Item>
              <Dropdown.Item>Created at</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Form.Row>
    </Form>
  );
};
