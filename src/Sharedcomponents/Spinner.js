import React, { Fragment } from "react";
import { Spin } from "antd";

const Spinner = (props) => {
  return (
    <Fragment>
      <div
        style={{
          position: "fixed",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(0, 0, 0, 0.5)",
          width: "100%",
          height: "100%",
          zIndex: 1000,
          left: 0,
          top: 0,
        }}
      >
        <Spin
          size="large"
          spinning={true}
          style={{ textAlign: "center" }}
        ></Spin>
      </div>
    </Fragment>
  );
};

export default Spinner;
