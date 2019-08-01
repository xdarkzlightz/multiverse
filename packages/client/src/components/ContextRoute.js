import React from "react";
import { Route } from "react-router-dom";

export default ({ contextComponent, component, initValue, ...rest }) => {
  const { Provider } = contextComponent;
  const Component = component;

  return (
    <Route {...rest}>
      <Provider value={initValue}>
        <Component />
      </Provider>
    </Route>
  );
};
