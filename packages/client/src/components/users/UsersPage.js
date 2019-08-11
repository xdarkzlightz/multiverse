import React from "react";

import Button from "react-bootstrap/Button";

import ListPage from "../lists/ListPage";
import UsersForm from "./UsersForm";
import sort from "../../utils/sort";

import multiverse from "../../api/multiverse";

export default () => (
  <ListPage
    config={{
      name: "Users",
      url: "users",
      Form: UsersForm,
      columns: [
        {
          name: "Username",
          sortFunc: data => sort(data, "username"),
          reverseSortFunc: data => sort(data, "username", true),
          filterFunc: ({ username }, val) => username.includes(val),
          Item: ({ username }) => <td>{username}</td>
        },
        {
          name: "Created at",
          sortFunc: data => sort(data, "createdAt", true),
          reverseSortFunc: data => sort(data, "createdAt"),
          filterFunc: ({ createdAt }, val) =>
            new Date(createdAt).toDateString().includes(val),
          Item: ({ createdAt }) => <td>{new Date(createdAt).toDateString()}</td>
        },
        {
          name: "Admin",
          sortFunc: data => sort(data, "admin", true),
          reverseSortFunc: data => sort(data, "admin"),
          filterFunc: ({ username }, val) => username.includes(val),
          Item: ({ admin }) => <td>{admin ? "admin" : "N/A"}</td>
        }
      ],
      RowDetails: ({ username, id, user, refetch }) =>
        username === "admin" || username === user.username ? null : (
          <div className="d-flex justify-content-between">
            <Button
              variant="success"
              onClick={() => {
                const confirmed = window.confirm(
                  `You're about to reset ${username}'s password to "password", are you sure?`
                );
                if (!confirmed) return;

                multiverse
                  .patch(`/users/${id}/resetPassword`, { password: "password" })
                  .then(refetch)
                  .catch(console.error);
              }}
            >
              Reset Password
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                const confirmed = window.confirm(
                  `You're about to remove ${username}, are you sure?`
                );
                if (!confirmed) return;

                multiverse
                  .delete(`users/${id}`)
                  .then(refetch)
                  .catch(console.error);
              }}
            >
              Remove
            </Button>
          </div>
        )
    }}
  />
);
