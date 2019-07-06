import React from "react";
import axios from "axios";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

export default ({ name, id, running, setContainers }) => {
  const doAction = async action => {
    await axios.post(`/docker/containers/${id}/${action}`);
    const res = await axios.get("/docker/containers");
    setContainers(res.data.containers);
  };

  return (
    <Card style={{ width: "16rem" }}>
      <Card.Header>{name}</Card.Header>
      <Card.Footer className="d-flex justify-content-around">
        {running ? (
          <>
            <Button
              variant="success"
              onClick={() =>
                window.open(`http://${window.location.hostname}:8443`)
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
