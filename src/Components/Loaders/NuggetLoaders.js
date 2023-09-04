/**
 * A React component that displays skeleton loaders for a nugget item.
 * @param {boolean} loading - Indicates whether the loaders should be in the loading state or not.
 * @returns A React component that renders the skeleton loaders for a nugget item.
 */
import React from "react";
import classes from "./Loaders.module.css";
import { Skeleton } from "antd";

/**
 * Renders a component that displays a loading state for Nugget items.
 * @param {boolean} loading - Indicates whether the loading state should be displayed.
 * @returns JSX element representing the NuggetLoaders component.
 */
const NuggetLoaders = ({ loading }) => {
  return (
    <div className={`${classes.nuggetItem}`}>
      <div className={classes.profilePart}>
        <Skeleton avatar paragraph={{ rows: 0 }} active={loading} />
        <Skeleton active={loading} />
      </div>
      <Skeleton.Node active={loading} className={classes.nuggetImg}>
        <span className="material-symbols-outlined">image</span>
      </Skeleton.Node>
    </div>
  );
};

export default NuggetLoaders;
