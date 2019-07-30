import React from "react";

import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import Col from "react-bootstrap/Col";

export default ({ filter, setFilter, search, setSearch }) => {
  return (
    <Form>
      <Form.Row className="d-flex justify-content-center">
        <Col xs="2">
          <h3 className="text-center">Projects</h3>
        </Col>
        <Col xs="4">
          <Form.Control
            plaintext
            placeholder="Search projects"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Col>
        <Col xs="3">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Sort by {filter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setFilter("a-z")}>
                a-z
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter("z-a")}>
                z-a
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter("created by: a-z")}>
                Created by: a-z
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter("created by: z-a")}>
                Created by: z-a
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter("created at: oldest")}>
                Created at: oldest
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter("created at: newest")}>
                Created at: newest
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Form.Row>
    </Form>
  );
};
