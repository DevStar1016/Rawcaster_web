import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import Fans from "./Fans";
import Groups from "./Groups";
import Connections from "./Connections";

const ContentLayout = () => {
  return (
    <Tabs
      defaultActiveKey="home"
      transition={false}
      id="noanim-tab-example"
      className="mb-3 notficationContainer"
    >
      <Tab eventKey="home" title="Fans">
        <Fans />
      </Tab>
      <Tab eventKey="profile" title="Groups">
        <Groups />
      </Tab>
      <Tab eventKey="contact" title="Connections">
        <Connections />
      </Tab>
    </Tabs>
  );
};

export default ContentLayout;
