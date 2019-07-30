import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import Container from "react-bootstrap/Container";

import Header from "../Header";
import Toolbar from "./ProjectsToolbar";
import ProjectsGrid from "./ProjectsGrid";
import ProjectsList from "./ProjectsList";
import { UserConsumer } from "../../context/UserContext";

import useApi from "../../hooks/useApi";

const sort = (data, type) => {
  let sortFunc;
  if (type === "a-z") {
    sortFunc = (a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    };
  } else if (type === "z-a") {
    sortFunc = (a, b) => {
      if (a.name < b.name) return 1;
      if (a.name > b.name) return -1;
      return 0;
    };
  } else if (type === "created by: a-z") {
    sortFunc = (a, b) => {
      if (a.username > b.username) return 1;
      if (a.username < b.username) return -1;
      return 0;
    };
  } else if (type === "created by: z-a") {
    sortFunc = (a, b) => {
      if (a.username < b.username) return 1;
      if (a.username > b.username) return -1;
      return 0;
    };
  } else if (type === "created at: oldest") {
    sortFunc = (a, b) => {
      const aCreatedAt = new Date(a.createdAt);
      const bCreatedAt = new Date(b.createdAt);

      if (aCreatedAt > bCreatedAt) return 1;
      if (aCreatedAt < bCreatedAt) return -1;
      return 0;
    };
  } else if (type === "created at: newest") {
    sortFunc = (a, b) => {
      const aCreatedAt = new Date(a.createdAt);
      const bCreatedAt = new Date(b.createdAt);

      if (aCreatedAt < bCreatedAt) return 1;
      if (aCreatedAt > bCreatedAt) return -1;
      return 0;
    };
  }

  data.sort(sortFunc);
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
  const [view, setView] = useState("grid");

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
            view={view}
            setView={setView}
          />
          {view === "grid" ? (
            <ProjectsGrid containers={containers} fetchData={fetchData} />
          ) : (
            <ProjectsList containers={containers} />
          )}
        </Container>
      </>
    );
  }
};
