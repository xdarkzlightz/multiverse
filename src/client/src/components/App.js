import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Containers from "./Containers";
import Header from "./Header";
import InstanceCreator from "./InstanceCreator";

export default () => {
  return (
    <Router>
      <Header />
      <Route path="/" exact component={Containers} />
      <Route path="/create" component={InstanceCreator} />
    </Router>
  );
};
