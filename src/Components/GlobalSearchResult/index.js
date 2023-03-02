import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import classes from "./GlobalSearch.module.css";
import NuggetsList from "./NuggetsList";

const GlobalSearchResult = () => {
  const [key, setKey] = useState("home");
  return (
    <div className="d-none d-sm-block">
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="home" title="Home">
          <div className={classes.fullcontainer}>
            <NuggetsList />
          </div>
        </Tab>
        <Tab eventKey="profile" title="Profile">
          <div className={classes.fullcontainer}>
            <NuggetsList />
          </div>
        </Tab>
        <Tab eventKey="contact" title="Contact" disabled>
          <div className={classes.fullcontainer}>
            <NuggetsList />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default GlobalSearchResult;
