import React from "react";

export default ({ dropDownState, columns, data, refetch, user, config }) => {
  const [dropdown, setDropdown] = dropDownState;
  return (
    <>
      <tr
        className="clickable"
        onClick={() => setDropdown(dropdown === data.id ? "" : data.id)}
      >
        {columns.map(c => (
          <c.Item {...data} key={c.name} />
        ))}
      </tr>
      {dropdown === data.id ? (
        <tr>
          <td id="col-detail" colSpan={columns.length}>
            <config.RowDetails {...data} refetch={refetch} user={user} />
          </td>
        </tr>
      ) : null}
    </>
  );
};
