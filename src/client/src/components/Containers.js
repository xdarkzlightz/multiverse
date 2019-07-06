import React, { useState } from "react";
import axios from "axios";

import DockerContainer from "./Container";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default () => {
  const [containers, setContainers] = useState([]);
  const [error, setError] = useState("");

  if (error) return <h1>{error}</h1>;
  if (!containers.length && !error) {
    axios
      .get("/docker/containers")
      .then(res => setContainers(res.data.containers))
      .catch(err => {
        console.log(err);
        setError(err.message);
      });
  }

  console.log(containers);
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
