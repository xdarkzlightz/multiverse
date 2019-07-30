import React from "react";
import axios from "axios";

import Card from "react-bootstrap/Card";
import ContainerButton from "./ProjectButton";

export default ({ data, setContainers }) => {
  const { name, id, running, port, username, createdAt } = data;

  const created = new Date(createdAt);

  const doAction = async action => {
    if (["stop", "kill", "remove"].includes(action)) {
      const confirmed = window.confirm(
        `You're about to ${action} ${name}, are you sure?`
      );
      if (!confirmed) return;
    }

    if (action === "remove") {
      await axios.delete(`/api/containers/${id}`);
    } else {
      await axios.post(`/api/containers/${id}/${action}`);
    }
    const res = await axios.get("/api/containers");
    setContainers(res.data);
  };

  const cardStyle = { width: "14rem" };

  return (
    <Card style={cardStyle} bg="secondary" text="light">
      <Card.Header className="text-center">
        {name.replace(/-/g, " ")}
        <br />
        {`By ${username}`}
        <br />
        {`Created ${created.toDateString()}`}
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
