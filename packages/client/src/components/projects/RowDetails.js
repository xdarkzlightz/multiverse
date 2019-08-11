import React from "react";

import Button from "react-bootstrap/Button";

import multiverse from "../../api/multiverse";

export default ({ name, id, refetch, port, running, username }) => {
  const doAction = async action => {
    if (["stop", "kill", "remove"].includes(action)) {
      const confirmed = window.confirm(
        `You're about to ${action} ${name}, are you sure?`
      );
      if (!confirmed) return;

      action === "remove"
        ? multiverse()
            .delete(`containers/${id}`)
            .then(refetch)
            .catch(console.error)
        : multiverse()
            .post(`containers/${id}/${action}`)
            .then(refetch)
            .catch(console.error);
    } else if (action === "start") {
      multiverse()
        .post(`containers/${id}/start`)
        .then(refetch)
        .catch(console.error);
    }
  };

  if (username === "admin") {
    return null;
  } else
    return running ? (
      <div className="d-flex justify-content-between">
        <Button
          variant="success"
          onClick={() =>
            window.open(`http://${window.location.hostname}:${port}`)
          }
          className="mr-auto"
        >
          Open
        </Button>
        <Button
          variant="danger"
          onClick={() => doAction("stop")}
          className="mr-3"
        >
          Stop
        </Button>
        <Button variant="danger" onClick={() => doAction("kill")}>
          Kill
        </Button>
      </div>
    ) : (
      <div className="d-flex justify-content-between">
        <Button variant="success" onClick={() => doAction("start")}>
          Start
        </Button>
        <Button variant="danger" onClick={() => doAction("remove")}>
          Remove
        </Button>
      </div>
    );
};
