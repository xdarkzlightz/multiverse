import React from "react";

import ListPage from "../lists/ListPage";
import ProjectForm from "./ProjectForm";
import sort from "../../utils/sort";
import RowDetails from "./RowDetails";
export default () => (
  <ListPage
    config={{
      name: "Projects",
      url: "containers",
      Form: ProjectForm,
      columns: [
        {
          name: "Username",
          sortFunc: data => sort(data, "name"),
          reverseSortFunc: data => sort(data, "name", true),
          filterFunc: ({ name }, val) => name.includes(val),
          Item: ({ name }) => <td>{name.replace(/-/g, " ")}</td>
        },
        {
          name: "Created By",
          test: u => u.admin,
          sortFunc: data => sort(data, "username"),
          reverseSortFunc: data => sort(data, "username", true),
          filterFunc: ({ username }, val) => username.includes(val),
          Item: ({ username }) => <td>{username}</td>
        },
        {
          name: "Created At",
          sortFunc: data => sort(data, "createdAt"),
          reverseSortFunc: data => sort(data, "createdAt", true),
          filterFunc: ({ createdAt }, val) =>
            new Date(createdAt).toDateString().includes(val),
          Item: ({ createdAt }) => <td>{new Date(createdAt).toDateString()}</td>
        }
      ],
      RowDetails
    }}
  />
);
