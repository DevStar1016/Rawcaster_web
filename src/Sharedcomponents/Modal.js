/**
 * A reusable modal component that can be used in React applications.
 * @param {Object} props - The props passed to the component.
 * @param {string} props.title - The title of the modal.
 * @param {boolean} props.isVisible - Determines whether the modal is visible or not.
 * @param {function} props.closeHandler - The function to be called when the modal is closed.
 * @param {boolean} [props.closable=true] - Determines whether the modal can be closed or not.
 * @param {ReactNode} props.children - The content to be displayed inside the modal.
 * @returns The modal component.
 */
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
