import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import classes from "./Influencers.module.css";

const SelectInfluencers = () => {
  return (
    <div className="dashboardContainer">
      <div className={classes.headerSec}>
        <h1>Welcome Danii - Select your influencers</h1>
        <div className={classes.btnSec}>
          <button>Skip this</button>
        </div>
      </div>
      <div className={classes.influencerContainer}>
        <div className={classes.filterSec}>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Recipient's username"
              aria-label="Recipient's username"
            />
            <InputGroup.Text>@example.com</InputGroup.Text>
          </InputGroup>
        </div>
      </div>
    </div>
  );
};

export default SelectInfluencers;
