import React from "react";
import axios from "axios";

import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import ListPage from "./lists/ListPage";

import ActionButton from "./projects/ActionButton";

export default () => {
  const config = {
    name: "Projects",
    headers: [
      "Name",
      { header: "Created By", test: u => u.admin },
      "Created At",
      "Actions"
    ],
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
    CreateButton: (
      <Button variant="success" as={Link} to="/create/project">
        Create
      </Button>
    ),
    Item: props => {
      const {
        name,
        id,
        username,
        createdAt,
        running,
        port,
        user,
        refetch
      } = props;
      const createdAtDate = new Date(createdAt);

      const doAction = async action => {
        const token = localStorage.getItem("token");
        if (["stop", "kill", "remove"].includes(action)) {
          const confirmed = window.confirm(
            `You're about to ${action} ${name}, are you sure?`
          );
          if (!confirmed) return;

          if (action === "remove") {
            axios
              .delete(
                `/api/containers/${id}`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              )
              .then(refetch)
              .catch(e => console.error(e));
          } else {
            axios
              .post(
                `/api/containers/${id}/${action}`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              )
              .then(refetch)
              .catch(e => console.error(e));
          }
        } else if (action === "start") {
          axios
            .post(
              `/api/containers/${id}/start`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            )
            .then(refetch)
            .catch(e => console.error(e.message));
        }
      };

      return (
        <tr>
          <td>{name.replace("-", " ")}</td>
          {user.admin ? <td>{username}</td> : <></>}
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

                <ActionButton variant="stop" onClick={() => doAction("stop")} />

                <ActionButton variant="kill" onClick={() => doAction("kill")} />
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
