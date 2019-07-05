import React from "react";
import DockerContainer from "./Container";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default ({ containers, setContainers }) => {
  return (
    <Container>
      <Row>
        {containers.map(c => (
          <Col xs={3} className="mb-3">
            <DockerContainer key={c.id} {...c} setContainers={setContainers} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};
