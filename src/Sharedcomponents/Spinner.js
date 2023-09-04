/**
 * A React component that displays a spinner while content is loading.
 * @param {object} props - The props object for the Spinner component.
 * @returns A React Fragment containing the spinner element.
 */
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
