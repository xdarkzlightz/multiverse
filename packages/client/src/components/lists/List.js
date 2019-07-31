import React from "react";

import Table from "react-bootstrap/Table";

export default ({ headers, data, Item }) => {
  return (
    <>
      <Table className="mt-3">
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(d => (
            <Item key={d.id} {...d} />
          ))}
        </tbody>
      </Table>
    </>
  );
};
