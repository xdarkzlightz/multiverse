import React from "react";

import axios from "axios";

import ListPage from "./lists/ListPage";
import ActionButton from "./projects/ActionButton";

export default () => {
  const config = {
    name: "Users",
    headers: ["Username", "Created at", "Actions"],
    url: "/api/users",
    filters: ["a-z", "z-a", "Created at: oldest", "Created at: newest"],
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
      } else if (["Created at: oldest", "Created at: newest"].includes(type)) {
        filter = c => {
          const createdAt = new Date(c.createdAt);
          return createdAt.toDateString().includes(value);
        };
      }

      return data.filter(filter);
    },
    Item: ({ username, createdAt, id, refetch }) => {
      const createdAtDate = new Date(createdAt);

      return (
        <tr>
          <td>{username}</td>
          <td>{createdAtDate.toDateString()}</td>
          <td>
            <ActionButton
              variant="remove"
              onClick={() => {
                const token = localStorage.getItem("token");
                axios
                  .delete(`/api/users/${id}`, {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  })
                  .then(() => {
                    refetch();
                  })
                  .catch(e => console.error(e));
              }}
            />
          </td>
        </tr>
      );
    }
  };

  return <ListPage config={config} />;
};
