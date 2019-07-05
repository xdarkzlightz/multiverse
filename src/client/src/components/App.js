import React, { useState } from "react";
import axios from "axios";

import Containers from "./Containers";
import Button from "react-bootstrap/Button";

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
      <div className="d-flex justify-content-between mb-5">
        <h1>Multiverse</h1>
        <Button
          onClick={async () => {
            await axios.post("docker/containers");
            const res = await axios.get("docker/containers");
            setContainers(res.data.containers);
          }}
        >
          Add New Instance
        </Button>
      </div>
      <Containers containers={containers} setContainers={setContainers} />
    </div>
  );
};
