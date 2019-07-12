import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Joi from "joi-browser";

import Button from "react-bootstrap/Button";
import schema from "../../validation/schema";

export default ({ onError, data }) => {
  const _data = { ...data };
  delete _data.curVol;
  delete _data.curPort;
  if (!_data.auth) _data.password = undefined;
  _data.path += `${_data.name}/`;

  const [submitted, setSubmitted] = useState(false);
  if (submitted) return <Redirect to="/" />;

  return (
    <Button
      variant="success"
      onClick={async e => {
        try {
          await Joi.validate(_data, schema);
          await axios.post("/api/v0/docker/containers", _data);
          setSubmitted(true);
        } catch (e) {
          onError(e.response ? e.response.data : e.message);
        }
      }}
    >
      Create
    </Button>
  );
};
