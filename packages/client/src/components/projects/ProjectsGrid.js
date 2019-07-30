import React from "react";

import Project from "./ProjectCard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default ({ containers, fetchData }) => {
  return (
    <>
      <Row className="mt-3">
        {containers.map(c => (
          <Col key={c.id} xs={12} sm={6} md={6} lg={4} xl={3} className="mb-3">
            <Project data={c} setContainers={fetchData} />
          </Col>
        ))}
      </Row>
    </>
  );
};
