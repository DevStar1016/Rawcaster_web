import { Skeleton } from "antd";
import React from "react";
import classes from "../Components/ProfilerRight.module.css";

/**
 * Renders a list of locked connections.
 * @returns {JSX.Element} - The rendered component.
 */
const LockedConnections = () => {
  return (
    <div className={classes.listSec}>
      {[...new Array(8)].map((ele) => {
        return (
          <div className={classes.list}>
            <Skeleton.Node
              active={false}
              style={{
                height: "60px",
                width: "60px",
                borderRadius: 50,
              }}
            >
              <img src={""} alt="User" />
            </Skeleton.Node>{" "}
            <p>{"User"}</p>
          </div>
        );
      })}
    </div>
  );
};

export default LockedConnections;
