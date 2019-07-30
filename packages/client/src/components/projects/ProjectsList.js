import React from "react";

import Table from "react-bootstrap/Table";
import ProjectsListItem from "./ProjectListItem";

export default ({ containers }) => {
  return (
    <>
      <Table className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Created by</th>
            <th>Created at</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {containers.map(c => (
            <ProjectsListItem key={c.id} {...c} />
          ))}
        </tbody>
      </Table>
    </>
  );
};
