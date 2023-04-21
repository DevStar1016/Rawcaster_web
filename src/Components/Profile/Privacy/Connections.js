import { Skeleton } from "antd";
import React from "react";
import classes from "../Components/ProfilerRight.module.css";

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
              <img src={""} />
            </Skeleton.Node>{" "}
            <p>{"User"}</p>
          </div>
        );
      })}
    </div>
  );
};

export default LockedConnections;
