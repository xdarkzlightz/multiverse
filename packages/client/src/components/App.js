import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import axios from "axios";

import ProjectsPage from "./ProjectsPage";
import InstanceCreator from "./projectForm/ProjectForm";
import Login from "./LoginPage";
import UsersPage from "./UsersPage";

import UserContext from "../context/UserContext";
import UsersForm from "./userForm/UsersForm";
import ContextRoute from "./ContextRoute";

export default () => {
  const [user, setUser] = useState({});
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("user_id");

  if (token && id && !user.id) {
    axios
      .get(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(e => console.log(e));
  }

  return (
    <Router>
      <Switch>
        <ContextRoute
          path="/projects"
          component={ProjectsPage}
          contextComponent={UserContext}
          initValue={{ user, setUser }}
        />
        <ContextRoute
          path="/users"
          component={UsersPage}
          contextComponent={UserContext}
          initValue={{ user, setUser }}
        />
        <ContextRoute
          path="/create/project"
          component={InstanceCreator}
          contextComponent={UserContext}
          initValue={{ user, setUser }}
        />
        <ContextRoute
          path="/create/user"
          component={UsersForm}
          contextComponent={UserContext}
          initValue={{ user, setUser }}
        />
        <Route path="/login">
          <Login setUser={setUser} user={user} />
        </Route>
        <Redirect from="/" exact to="/projects" />
      </Switch>
    </Router>
  );
};
