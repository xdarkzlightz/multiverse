import React from "react";

import Table from "react-bootstrap/Table";

export default ({ headers, data, Item, user, refetch }) => {
  return (
    <>
      <Table className="mt-3">
        <thead>
          <tr>
            {headers.map(h => {
              if (typeof h === "string") {
                return <th key={h}>{h}</th>;
              } else if (typeof h === "object") {
                const pass = h.test(user);
                if (pass) {
                  return <th key={h.header}>{h.header}</th>;
                } else {
                  return undefined;
                }
              } else {
                return undefined;
              }
            })}
          </tr>
        </thead>
        <tbody>
          {data.map(d => (
            <Item key={d.id} {...d} refetch={refetch} user={user} />
          ))}
        </tbody>
      </Table>
    </>
  );
};
