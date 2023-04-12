import React from "react";
import { Tab, Tabs } from "react-bootstrap";

const ContentLayout = () => {
  return (
    <Tabs
      defaultActiveKey="home"
      transition={false}
      id="noanim-tab-example"
      className="mb-3 notficationContainer"
    >
      <Tab eventKey="home" title="Fans">
        <div>1234</div>
      </Tab>
      <Tab eventKey="profile" title="Groups">
        <div>1234</div>
      </Tab>
      <Tab eventKey="contact" title="Connections">
        <div>1234</div>
      </Tab>
    </Tabs>
  );
};

export default ContentLayout;
