import React from "react";
import ContainerButton from "./ProjectButton";

export default ({ name, username, createdAt, running, port }) => {
  const createdAtDate = new Date(createdAt);

  const doAction = async action => {
    if (["stop", "kill", "remove"].includes(action)) {
      const confirmed = window.confirm(
        `You're about to ${action} ${name}, are you sure?`
      );
      if (!confirmed) return;
    }
  };

  return (
    <tr>
      <td>{name.replace("-", " ")}</td>
      <td>{username}</td>
      <td>{createdAtDate.toDateString()}</td>
      <td>
        {running ? (
          <div className="d-flex justify-content-between">
            <ContainerButton
              variant="open"
              onClick={() =>
                window.open(`http://${window.location.hostname}:${port}`)
              }
            />

            <div>
              <span>
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
          <div className="d-flex justify-content-between">
            <ContainerButton
              variant="start"
              onClick={() => doAction("start")}
            />
            <span>
              <ContainerButton
                variant="remove"
                onClick={() => doAction("remove")}
              />
            </span>
          </div>
        )}
      </td>
    </tr>
  );
};
