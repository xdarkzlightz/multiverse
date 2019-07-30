import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import axios from "axios";

import ProjectsPage from "./projects/ProjectsPage";
import InstanceCreator from "./instanceForm/InstanceCreator";
import Login from "./LoginPage";
import UsersList from "./users/UsersList";

import { UserProvider } from "../context/UserContext";

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
        <Route path="/projects">
          <UserProvider value={{ user, setUser }}>
            <ProjectsPage />
          </UserProvider>
        </Route>
        <Route path="/users" component={UsersList} />
        <Route path="/create" component={InstanceCreator} />
        <Route path="/login">
          <Login setUser={setUser} user={user} />
        </Route>
        <Redirect from="/" exact to="/projects" />
      </Switch>
    </Router>
  );
};
