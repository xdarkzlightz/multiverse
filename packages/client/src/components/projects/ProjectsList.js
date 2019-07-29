import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

import Project from "./Project";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import Header from "../Header";
import Toolbar from "./ProjectsToolbar";
import { UserConsumer } from "../../context/UserContext";

import useApi from "../../hooks/useApi";

const sort = (data, type) => {
  let filter;
  if (type === "a-z") {
    filter = (a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    };
  } else if (type === "z-a") {
    filter = (a, b) => {
      if (a.name < b.name) return 1;
      if (a.name > b.name) return -1;
      return 0;
    };
  } else if (type === "created by: a-z") {
    filter = (a, b) => {
      if (a.username > b.username) return 1;
      if (a.username < b.username) return -1;
      return 0;
    };
  } else if (type === "created by: z-a") {
    filter = (a, b) => {
      if (a.username < b.username) return 1;
      if (a.username > b.username) return -1;
      return 0;
    };
  } else if (type === "created at: oldest") {
    filter = (a, b) => {
      const aCreatedAt = new Date(a.createdAt);
      const bCreatedAt = new Date(b.createdAt);

      if (aCreatedAt > bCreatedAt) return 1;
      if (aCreatedAt < bCreatedAt) return -1;
      return 0;
    };
  } else if (type === "created at: newest") {
    filter = (a, b) => {
      const aCreatedAt = new Date(a.createdAt);
      const bCreatedAt = new Date(b.createdAt);

      if (aCreatedAt < bCreatedAt) return 1;
      if (aCreatedAt > bCreatedAt) return -1;
      return 0;
    };
  }

  data.sort(filter);
};

export default () => {
  const [{ data, loading, error, auth }, fetchData] = useApi([]);
  const [filter, setFilter] = useState("a-z");
  useEffect(() => {
    fetchData("/api/containers");
  }, [fetchData]);

  sort(data, filter);

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
          <h1 className="text-center display-4 mb-4">Projects</h1>
          <Toolbar setFilter={setFilter} filter={filter} />
          <Row className="mt-3">
            {data.map(c => (
              <Col
                key={c.id}
                xs={12}
                sm={6}
                md={6}
                lg={4}
                xl={3}
                className="mb-3"
              >
                <Project data={c} setContainers={fetchData} />
              </Col>
            ))}
          </Row>
        </Container>
      </>
    );
  }
};
