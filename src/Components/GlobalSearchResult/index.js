import React from "react";
import classes from "./GlobalSearch.module.css";
import NuggetsList from "./NuggetsList";

const GlobalSearchResult = () => {
  return (
    <div className="d-none d-sm-block">
      <div className={classes.fullcontainer}>
        <NuggetsList />
      </div>
    </div>
  );
};

export default GlobalSearchResult;
