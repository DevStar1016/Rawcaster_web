/**
 * A React component that renders a modal for inviting fans.
 * @param {boolean} open - Determines whether the modal is open or closed.
 * @param {function} close - A function to close the modal.
 * @returns A modal component for inviting fans.
 */

import { Modal } from "antd";
import { EmailReferalContainer } from "./utility";

const InviteFansModal = ({ open, close }) => {
  return (
    <Modal
      open={open}
      destroyOnClose={() => {
        close();
      }}
      onCancel={() => {
        close();
      }}
      footer={null}
      width={600}
    >
      <EmailReferalContainer close={close} />
    </Modal>
  );
};

export default InviteFansModal;
