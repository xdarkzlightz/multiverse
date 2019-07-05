import React from "react";
import Container from "./Container";

export default ({ containers, setContainers }) => {
  return (
    <ul>
      {containers.map(c => (
        <Container key={c.id} {...c} setContainers={setContainers} />
      ))}
    </ul>
  );
};
