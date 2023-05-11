import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useParams } from "react-router";
import Nuggets from "../../Sharedcomponents/Nuggets/Nuggets";
import EventsList from "./EventsList";
import classes from "./GlobalSearch.module.css";
import ProfileList from "./ProfileList";
import TagsList from "./TagsList";
import { DecryptionString } from "../../Shared/Utility";

const GlobalSearchResult = () => {
  const [key, setKey] = useState("Profile");
  const params = useParams();
  const searchKey = params?.key ? DecryptionString(params?.key) : "";
  return (
    <div>
      <div className={classes.mainContainer}>
        <p className={classes.searchResultName}>
          Search Results for <span>{searchKey}</span>{" "}
        </p>
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className={`mt-3 search_tab ${classes.search_tab}`}
        >
          <Tab eventKey="Profile" title="Profile">
            <div className={classes.fullcontainer}>
              <ProfileList />
            </div>
          </Tab>
          <Tab eventKey="Nuggets" title="Nuggets">
            {/* <div className={classes.fullcontainer}> */}
            <Nuggets />
            {/* </div> */}
          </Tab>
          <Tab eventKey="Events" title="Events">
            <div className={classes.fullcontainer}>
              <EventsList />
            </div>
          </Tab>
          <Tab eventKey="#Tags" title="#Tags">
            <div className={classes.fullcontainer}>
              <TagsList />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default GlobalSearchResult;
