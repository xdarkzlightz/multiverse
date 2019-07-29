import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import ProjectsList from "./projects/ProjectsList";
import InstanceCreator from "./instanceForm/InstanceCreator";
import Login from "./LoginPage";
import { UserProvider } from "../context/UserContext";

export default () => {
  return (
    <Router>
      <Switch>
        <Route path="/projects" exact>
          <UserProvider>
            <ProjectsList />
          </UserProvider>
        </Route>
        <Route path="/create" component={InstanceCreator} />
        <Route path="/login" component={Login} />
        <Redirect from="/" to="/projects" />
      </Switch>
    </Router>
  );
};
