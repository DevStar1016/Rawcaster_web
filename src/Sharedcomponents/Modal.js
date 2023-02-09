import { Modal } from "antd";
import React, { Fragment } from "react";

export const SharedModal = (props) => {
  return (
    <Fragment>
      <Modal
        title={props.title}
        centered
        open={props.isVisible}
        onOk={props.closeHandler}
        onCancel={props.closeHandler}
        closable={props.closable ? false : true}
        footer={[]}
      >
        {props.children}
      </Modal>
    </Fragment>
  );
};
