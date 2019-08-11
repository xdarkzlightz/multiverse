import React from "react";

import Table from "react-bootstrap/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import ListRow from "./ListRow";

export default ({
  dropdownState,
  items,
  config,
  user,
  refetch,
  sortState,
  search
}) => {
  const [{ sort, reverse }, setSort] = sortState;
  const column = config.columns.find(({ name }) => sort === name);
  const data = [...items].filter(d => column.filterFunc(d, search));
  reverse ? column.reverseSortFunc(data) : column.sortFunc(data);

  return (
    <Table className="mt-3">
      <thead>
        <tr>
          {config.columns.map(c => (
            <td
              onClick={() =>
                setSort({
                  sort: c.name,
                  reverse: c.name === sort ? !reverse : false
                })
              }
              key={c.name}
              className="clickable"
            >
              {c.name + " "}
              <FontAwesomeIcon
                icon={reverse && sort === c.name ? faArrowUp : faArrowDown}
                size="sm"
              />
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(d => (
          <ListRow
            user={user}
            key={d.id}
            data={d}
            columns={config.columns}
            config={config}
            refetch={refetch}
            dropDownState={dropdownState}
          />
        ))}
      </tbody>
    </Table>
  );
};
