import React from "react";
import classes from "./Loaders.module.css";
import { Skeleton } from "antd";

const NuggetLoaders = ({ loading }) => {
  return (
    <div className={`${classes.nuggetItem}`}>
      <div className={classes.profilePart}>
        <Skeleton avatar paragraph={{ rows: 0 }} active={loading} />
        <Skeleton active={loading} />
      </div>
      <Skeleton.Node active={loading} className={classes.nuggetImg}>
        <span class="material-symbols-outlined">image</span>
      </Skeleton.Node>
    </div>
  );
};

export default NuggetLoaders;
