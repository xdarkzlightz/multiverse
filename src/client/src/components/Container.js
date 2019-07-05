import React from "react";
import axios from "axios";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default ({ name, id, setContainers }) => {
  return (
    <Card style={{ width: "14rem" }}>
      <Card.Header>{name}</Card.Header>
      <Card.Footer>
        <Row>
          <Col>
            <Button
              onClick={async () => {
                await axios.post(`/docker/containers/${id}/stop`);
                const res = await axios.get("/docker/containers");
                setContainers(res.data.containers);
              }}
            >
              Stop
            </Button>
          </Col>

          <Col>
            <Button>Kill</Button>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};
