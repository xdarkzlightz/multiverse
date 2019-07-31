import React from "react";

import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import Col from "react-bootstrap/Col";

export default props => {
  const {
    filter,
    setFilter,
    search,
    setSearch,
    name,
    filters,
    CreateButton
  } = props;

  return (
    <Form>
      <Form.Row className="d-flex justify-content-center">
        <Col xs="2">
          <h3 className="text-center">{name}</h3>
        </Col>
        <Col xs="4">
          <Form.Control
            plaintext
            placeholder={`Search ${name}`}
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
              {filters.map(f => (
                <Dropdown.Item onClick={() => setFilter(f)} key={f}>
                  {f}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col className="d-flex justify-content-end">{CreateButton}</Col>
      </Form.Row>
    </Form>
  );
};
