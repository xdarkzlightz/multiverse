import React from "react";

import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route
} from "react-router-dom";

import ProjectsPage from "../projects/ProjectsPage";
import LoginPage from "../login/LoginPage";
import UsersPage from "../users/UsersPage";
import SettingsPage from "../settings/SettingsPage";

import UserRoute from "./UserRoute";

export default () => {
  return (
    <Router>
      <Switch>
        <UserRoute path="/projects" component={ProjectsPage} />
        <UserRoute path="/users" component={UsersPage} admin />
        <UserRoute path="/settings" component={SettingsPage} />
        <Route path="/login">
          <LoginPage />
        </Route>
        <Redirect from="/" exact to="/projects" />
      </Switch>
    </Router>
  );
};
