import React from "react";
import { Route } from "react-router-dom";

export default ({ component, provider, init, ...rest }) => {
  const Component = component;
  const Provider = provider;
  return (
    <Route {...rest}>
      <Provider value={init}>
        <Component />
      </Provider>
    </Route>
  );
};
