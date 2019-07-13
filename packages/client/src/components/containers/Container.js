import React from "react";
import axios from "axios";

import Card from "react-bootstrap/Card";
import ContainerButton from "./ContainerButton";

export default ({ name, id, running, port, setContainers }) => {
  const doAction = async action => {
    if (["stop", "kill", "remove"].includes(action)) {
      const confirmed = window.confirm(
        `You're about to ${action} ${name}, are you sure?`
      );
      if (!confirmed) return;
    }
    await axios.post(`/api/v0/docker/containers/${id}/${action}`);
    const res = await axios.get("/api/v0/docker/containers");
    setContainers(res.data.containers);
  };

  const cardStyle = { width: "14rem" };

  return (
    <Card style={cardStyle} bg="secondary" text="light">
      <Card.Header className="text-center">
        {name.replace(/-/g, " ")}
      </Card.Header>
      <Card.Footer>
        {running ? (
          <div className="d-flex">
            <ContainerButton
              variant="open"
              onClick={() =>
                window.open(`http://${window.location.hostname}:${port}`)
              }
            />

            <div className="ml-auto">
              <span className="mr-2">
                <ContainerButton
                  variant="stop"
                  onClick={() => doAction("stop")}
                />
              </span>

              <ContainerButton
                variant="kill"
                onClick={() => doAction("kill")}
              />
            </div>
          </div>
        ) : (
          <div className="d-flex">
            <ContainerButton
              variant="start"
              onClick={() => doAction("start")}
            />
            <span className="ml-auto">
              <ContainerButton
                variant="remove"
                onClick={() => doAction("remove")}
                className="ml-5"
              />
            </span>
          </div>
        )}
      </Card.Footer>
    </Card>
  );
};
