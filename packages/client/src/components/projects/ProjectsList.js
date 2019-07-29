import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";

import Project from "./Project";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import Header from "../Header";

import useApi from "../../hooks/useApi";

export default () => {
  const [{ data, loading, error, auth }, fetchData] = useApi([]);

  useEffect(() => {
    fetchData("/api/containers");
  }, [fetchData]);

  if (loading) {
    return <></>;
  } else if (error && !auth) {
    return <Redirect to="/login" />;
  } else if (error) {
    return <h1>Error has occured</h1>;
  } else {
    return (
      <>
        <Header />
        <Container>
          <Row>
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
                <Project {...c} setContainers={fetchData} />
              </Col>
            ))}
          </Row>
        </Container>
      </>
    );
  }
};
