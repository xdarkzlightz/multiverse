import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import { UserProvider } from "../context/UserContext";

import multiverse from "../../api/multiverse";
import ContextRoute from "./ContextRoute";

export default ({ component, admin, ...rest }) => {
  const [user, setUser] = useState({});
  const id = localStorage.getItem("user_id");

  if (!user.admin && user.id && admin) return <Redirect to="/" />;

  if (id && !user.id) {
    multiverse
      .get(`users/${id}`)
      .then(res => setUser(res.data))
      .catch(console.error);
  }

  if (!id) return <Redirect to="/login" />;

  const Component = component;
  return (
    <ContextRoute
      component={Component}
      provider={UserProvider}
      init={{ user, setUser }}
      {...rest}
    />
  );
};
