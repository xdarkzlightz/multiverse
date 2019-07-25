import React, { useState, useEffect } from "react";
import axios from "axios";

import DockerContainer from "./Container";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default () => {
  const [containers, setContainers] = useState([]);
  const [error, setError] = useState("");

  if (error) return <h1>{error}</h1>;

  useEffect(() => {
    if (!containers.length && !error) {
      axios
        .get("/api/containers")
        .then(res => setContainers(res.data))
        .catch(err => setError(err.message));
    }
  }, [containers.length, error]);

  return (
    <Container>
      <Row>
        {containers.map(c => (
          <Col key={c.id} xs={12} sm={6} md={6} lg={4} xl={3} className="mb-3">
            <DockerContainer {...c} setContainers={setContainers} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};
