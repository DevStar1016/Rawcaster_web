/**
 * A React component that displays a skeleton loader for an event item.
 * @returns {JSX.Element} - The JSX element representing the event loader.
 */
import { Skeleton } from "antd";
import React from "react";
import classes from "./Loaders.module.css";

/**
 * Renders a component that displays an event item with skeleton loading effect.
 * @returns JSX element representing the event item component.
 */
const EventLoaders = () => {
  return (
    <div className={`${classes.eventItem}`}>
      <Skeleton.Node active={true} className={classes.eventImg}>
        <span className="material-symbols-outlined">image</span>
      </Skeleton.Node>
      <div className={classes.contentSec}>
        <Skeleton loading={true}>
          <h4 style={{ marginBottom: 16 }}>Ant Design, a design language</h4>
          <p>
            We supply a series of design principles, practical patterns and high
            quality design resources (Sketch and Axure), to help people create
            their product prototypes beautifully and efficiently.
          </p>
        </Skeleton>
      </div>
    </div>
  );
};

export default EventLoaders;
