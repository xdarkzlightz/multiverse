import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import Container from "react-bootstrap/Container";

import Header from "../Header";
import Toolbar from "./ProjectsToolbar";
import ProjectsList from "./ProjectsList";
import { UserConsumer } from "../../context/UserContext";

import useApi from "../../hooks/useApi";

const sort = (data, type) => {
  const sortFunc = (prop, reverse) => {
    data.sort((a, b) => {
      const val = a[prop];
      const _val = b[prop];

      if (!reverse) {
        if (val > _val) return 1;
        if (val < _val) return -1;
      } else {
        if (val < _val) return 1;
        if (val > _val) return -1;
      }
      return 0;
    });
  };

  switch (type) {
    case "a-z":
      return sortFunc("name");
    case "z-a":
      return sortFunc("name", true);
    case "created by: a-z":
      return sortFunc("username");
    case "created by: z-a":
      return sortFunc("username", true);
    case "createdAt: oldest":
      return sortFunc("createdAt");
    case "createdAt: newest":
      return sortFunc("createdAt", true);
    default:
      return;
  }
};

const filterData = (data, value, type) => {
  let filter;
  if (["a-z", "z-a"].includes(type)) {
    filter = c => c.name.includes(value);
  } else if (["created by: a-z", "created by: z-a"].includes(type)) {
    filter = c => c.username.includes(value);
  } else if (["created at: oldest", "created at: newest"].includes(type)) {
    filter = c => {
      const createdAt = new Date(c.createdAt);
      return createdAt.toDateString().includes(value);
    };
  }

  return data.filter(filter);
};

export default () => {
  const [{ data, loading, error, auth }, fetchData] = useApi([]);

  const [filter, setFilter] = useState("a-z");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData("/api/containers");
  }, [fetchData]);

  sort(data, filter);

  const containers = filterData(data, search, filter);

  if (loading) {
    return <></>;
  } else if (error && !auth) {
    return <Redirect to="/login" />;
  } else if (error) {
    return <h1>Error has occured</h1>;
  } else {
    return (
      <>
        <UserConsumer>{data => <Header {...data} />}</UserConsumer>
        <Container>
          <Toolbar
            setFilter={setFilter}
            filter={filter}
            search={search}
            setSearch={setSearch}
          />

          <ProjectsList containers={containers} />
        </Container>
      </>
    );
  }
};
