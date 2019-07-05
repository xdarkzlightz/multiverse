import React, { useState } from "react";
import axios from "axios";

import Containers from "./Containers";

export default () => {
  const [containers, setContainers] = useState([]);
  if (!containers.length) {
    axios
      .get("/docker/containers")
      .then(res => setContainers(res.data.containers))
      .catch(err => console.log);
  }

  return (
    <div>
      <Containers containers={containers} setContainers={setContainers} />
      <button
        onClick={async () => {
          await axios.post("docker/containers");
          const res = await axios.get("docker/containers");
          setContainers(res.data.containers);
        }}
      >
        Add New Instance
      </button>
    </div>
  );
};
