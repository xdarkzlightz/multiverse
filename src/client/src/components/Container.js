import React from "react";
import axios from "axios";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

export default ({ name, id, running, port, setContainers }) => {
  const doAction = async action => {
    await axios.post(`/docker/containers/${id}/${action}`);
    const res = await axios.get("/docker/containers");
    setContainers(res.data.containers);
  };

  const cardStyle = { width: "16rem" };

  return (
    <Card style={cardStyle} bg="secondary" text="light">
      <Card.Header className="text-center">
        {name.replace(/_/g, " ")}
      </Card.Header>
      <Card.Footer className="d-flex justify-content-around">
        {running ? (
          <>
            <Button
              variant="success"
              onClick={() =>
                window.open(`http://${window.location.hostname}:${port}`)
              }
            >
              Open
            </Button>
            <Button onClick={() => doAction("stop")} variant="danger">
              Stop
            </Button>
            <Button onClick={() => doAction("kill")} variant="danger">
              Kill
            </Button>
          </>
        ) : (
          <>
            <Button variant="success">Start</Button>
            <Button onClick={() => doAction("remove")} variant="danger">
              Remove
            </Button>
          </>
        )}
      </Card.Footer>
    </Card>
  );
};
