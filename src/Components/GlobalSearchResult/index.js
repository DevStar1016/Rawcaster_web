/**
 * A React component that displays the global search results.
 * @returns {JSX.Element} - The rendered component.
 */
import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useParams } from "react-router";
import Nuggets from "../../Sharedcomponents/Nuggets/Nuggets";
import EventsList from "./EventsList";
import classes from "./GlobalSearch.module.css";
import ProfileList from "./ProfileList";
import TagsList from "./TagsList";
import { DecryptionString } from "../../Shared/Utility";
import { IS_CHIME_ENABLE } from "../../Shared/Constant";

const GlobalSearchResult = () => {
  const [key, setKey] = useState("Profile");
  const params = useParams();
  const searchKey = params?.key ? DecryptionString(params?.key) : "";
  return (
    <div>
      <div className={`searchNugets ${classes.mainContainer}`}>
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
              {key === "Profile" && <ProfileList />}
            </div>
          </Tab>
          <Tab eventKey="Nuggets" title="Nuggets">
            {/* <div className={classes.fullcontainer}> */}
            {key === "Nuggets" && <Nuggets />}
            {/* </div> */}
          </Tab>
          {IS_CHIME_ENABLE && (
            <Tab eventKey="Events" title="Events">
              <div className={classes.fullcontainer}>
                {key === "Events" && <EventsList />}
              </div>
            </Tab>
          )}
          <Tab eventKey="#Tags" title="#Tags">
            <div className={classes.fullcontainer}>
              {key === "#Tags" && <TagsList />}
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default GlobalSearchResult;
