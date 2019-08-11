import React from "react";
import { UserConsumer } from "../context/UserContext";
import Header from "../header/Header";
import PasswordChangeForm from "./PasswordChangeForm";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default () => {
  return (
    <>
      <UserConsumer>{user => <Header {...user} />}</UserConsumer>
      <Container>
        <h1 className="text-center">Settings</h1>
        <Row className="d-flex justify-content-center mt-5">
          <Col xs="6">
            <PasswordChangeForm />
          </Col>
        </Row>
      </Container>
    </>
  );
};
