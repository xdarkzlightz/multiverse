import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import Button from "react-bootstrap/Button";

export default ({ onError, data }) => {
  const { name, password, auth, port, path, http, volumes, ports } = data;
  const [submitted, setSubmitted] = useState(false);
  if (submitted) return <Redirect to="/" />;

  return (
    <Button
      variant="success"
      onClick={async e => {
        try {
          if (!name) {
            return onError("You must have a project name.");
          } else if (!password && auth) {
            return onError("You must have a password");
          } else if (!port) {
            return onError("You must have a port");
          } else if (!path) {
            return onError("You must have a project path");
          }

          await axios.post("/docker/containers", {
            name: name.replace(/\s/g, "-"),
            password: auth ? password : undefined,
            path: path + `/${name}`,
            http,
            port,
            auth,
            volumes,
            ports
          });
          setSubmitted(true);
        } catch (e) {
          console.log(e.response);
          onError(e.response.data.message);
        }
      }}
    >
      Create
    </Button>
  );
};
