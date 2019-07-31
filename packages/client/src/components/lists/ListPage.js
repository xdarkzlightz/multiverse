import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import Container from "react-bootstrap/Container";

import Header from "../Header";
import Toolbar from "./ListsToolbar";
import List from "./List";
import { UserConsumer } from "../../context/UserContext";

import useApi from "../../hooks/useApi";

export default ({ config }) => {
  const [{ data, loading, error, auth }, fetchData] = useApi([]);
  const [filter, setFilter] = useState("a-z");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData(config.url);
  }, [config.url, fetchData]);

  config.sort(data, filter);

  const filteredData = config.filter(data, search, filter);

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
            name={config.name}
            filters={config.filters}
          />

          <List
            data={filteredData}
            Item={config.Item}
            headers={config.headers}
          />
        </Container>
      </>
    );
  }
};
