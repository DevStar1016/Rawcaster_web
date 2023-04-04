import React from "react";
import classes from "./Settings.module.css";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import General from "./General";

const Settings = () => {
  return (
    <div className={classes.settingSec}>
      <Tab.Container
        id="left-tabs-example"
        defaultActiveKey="first"
        className="mt-5"
      >
        <Row>
          <Col sm={2}>
            <div className={`${classes.sidebar} settingsBar`}>
              <Nav variant="pills" className="flex-column">
                <h2>Settings</h2>
                <Nav.Item>
                  <Nav.Link eventKey="general">General</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="notifications">Notifications</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="blocking">Blocking</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="change_password">
                    Change Password
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="event_setting">Event Settings</Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="general">
                <General />
              </Tab.Pane>
              <Tab.Pane eventKey="notifications">
                <div>Notifications</div>
              </Tab.Pane>
              <Tab.Pane eventKey="blocking">
                <div>Blocking</div>
              </Tab.Pane>
              <Tab.Pane eventKey="change_password">
                <div>Change Password</div>
              </Tab.Pane>
              <Tab.Pane eventKey="event_setting">
                <div>Event Settings</div>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default Settings;
