/**
 * A React component that displays a progress bar and a spinning icon while a post is being processed.
 * @returns {JSX.Element} - The rendered React component.
 */
import { Progress, Spin } from "antd";
import React from "react";
import { useListNuggetContext } from "../../Shared/Context";
import classes from "./PostNuggets.module.css";

const PostProgress = () => {
  const { getProgress } = useListNuggetContext();

  const spinShow = () => {
    if (
      parseInt(getProgress().percent) === 100 &&
      getProgress().show === true
    ) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <div className={classes.postNuggets}>
      <Spin tip="Please Wait..." size="small" spinning={spinShow()}>
        <Progress percent={getProgress().percent} strokeColor="#563662" />
      </Spin>
    </div>
  );
};

export default PostProgress;
