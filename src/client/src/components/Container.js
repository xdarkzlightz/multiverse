import React from "react";
import axios from "axios";

export default ({ name, id, setContainers }) => {
  return (
    <li>
      {name}
      <button
        onClick={async () => {
          await axios.post(`/docker/containers/${id}/stop`);
          const res = await axios.get("/docker/containers");
          setContainers(res.data.containers);
        }}
      >
        Stop
      </button>
      <button>Kill</button>
    </li>
  );
};
