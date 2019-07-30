import React from "react";

import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import Col from "react-bootstrap/Col";

export default ({ filter, setFilter, search, setSearch, view, setView }) => {
  return (
    <Form>
      <Form.Row className="d-flex justify-content-center">
        <Col xs="2" />
        <Col xs={5}>
          <Form.Control
            plaintext
            placeholder="Search projects"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Col>
        <Col xs="2">
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
        <Col xs="1">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {view}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setView("grid")}>
                grid
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setView("list")}>
                list
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Form.Row>
    </Form>
  );
};
