import React from "react";

import ListPage from "./lists/ListPage";

import ActionButton from "./projects/ActionButton";

export default () => {
  const config = {
    name: "Projects",
    headers: ["Name", "Created By", "Created At", "Actions"],
    url: "/api/containers",
    filters: [
      "a-z",
      "z-a",
      "Created by: a-z",
      "Created by: z-a",
      "Created at: oldest",
      "Created at: newest"
    ],
    sort: (data, type) => {
      const sortFunc = (prop, reverse) => {
        data.sort((a, b) => {
          const val = a[prop];
          const _val = b[prop];

          if (!reverse) {
            if (val > _val) return 1;
            if (val < _val) return -1;
          } else {
            if (val < _val) return 1;
            if (val > _val) return -1;
          }
          return 0;
        });
      };

      switch (type) {
        case "a-z":
          return sortFunc("username");
        case "z-a":
          return sortFunc("username", true);
        case "Created at: oldest":
          return sortFunc("createdAt");
        case "Created by: a-z":
          return sortFunc("username");
        case "Created by: z-a":
          return sortFunc("username", true);
        case "Created at: newest":
          return sortFunc("createdAt", true);
        default:
          return;
      }
    },
    filter: (data, value, type) => {
      let filter;
      if (["a-z", "z-a"].includes(type)) {
        filter = c => c.username.includes(value);
      } else if (["Created by: a-z", "Created by: z-a"].includes(type)) {
        filter = c => c.username.includes(value);
      } else if (["Created at: oldest", "Created at: newest"].includes(type)) {
        filter = c => {
          const createdAt = new Date(c.createdAt);
          return createdAt.toDateString().includes(value);
        };
      }

      return data.filter(filter);
    },
    Item: ({ name, username, createdAt, running, port }) => {
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
                <ActionButton
                  variant="open"
                  onClick={() =>
                    window.open(`http://${window.location.hostname}:${port}`)
                  }
                />

                <div>
                  <span>
                    <ActionButton
                      variant="stop"
                      onClick={() => doAction("stop")}
                    />
                  </span>

                  <ActionButton
                    variant="kill"
                    onClick={() => doAction("kill")}
                  />
                </div>
              </div>
            ) : (
              <div className="d-flex justify-content-between">
                <ActionButton
                  variant="start"
                  onClick={() => doAction("start")}
                />
                <span>
                  <ActionButton
                    variant="remove"
                    onClick={() => doAction("remove")}
                  />
                </span>
              </div>
            )}
          </td>
        </tr>
      );
    }
  };

  return <ListPage config={config} />;
};
