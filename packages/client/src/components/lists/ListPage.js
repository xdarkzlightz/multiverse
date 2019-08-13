import React, { useState, useEffect } from "react";

import Container from "react-bootstrap/Container";
import Header from "../header/Header";
import List from "./List";
import { UserConsumer } from "../context/UserContext";

import multiverse from "../../api/multiverse";
import Button from "react-bootstrap/Button";

export default ({ config }) => {
  const [{ data, refetch, fetched }, setData] = useState({
    data: [],
    refetch: false,
    fetched: false
  });
  const [search, setSearch] = useState("");
  const sort = useState({
    sort: config.columns[0].name,
    reverse: false
  });
  const [displayForm, setDisplayForm] = useState(false);
  const dropdownState = useState("");
  const refetchData = () =>
    setData({ data: [...data], refetch: true, fetched: true });

  useEffect(() => {
    if ((!data.length || refetch) && (!fetched || refetch)) {
      multiverse
        .get(config.url)
        .then(({ data }) => setData({ data, refetch: false, fetched: true }))
        .catch(console.error);
    }
  }, [data, config.url, refetch, fetched]);

  if (!fetched) return <></>;

  return (
    <>
      <UserConsumer>
        {userState => (
          <>
            <Header
              {...userState}
              search={search}
              setSearch={setSearch}
              searchbar
            />
            {displayForm ? (
              <config.Form
                setDisplayForm={setDisplayForm}
                refetch={refetchData}
              />
            ) : (
              <Container>
                <div className="d-flex justify-content-between">
                  <h3>{config.name}</h3>
                  <span>
                    <Button
                      variant="success"
                      onClick={() => setDisplayForm(true)}
                    >
                      Create
                    </Button>
                  </span>
                </div>

                <List
                  items={data}
                  config={config}
                  user={userState.user}
                  refetch={refetchData}
                  sortState={sort}
                  search={search}
                  dropdownState={dropdownState}
                />
              </Container>
            )}
          </>
        )}
      </UserConsumer>
    </>
  );
};
