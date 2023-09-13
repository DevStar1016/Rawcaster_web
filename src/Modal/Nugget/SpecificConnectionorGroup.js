/**
 * A modal component that allows the user to select specific connections or groups.
 * @param {boolean} open - Determines whether the modal is open or closed.
 * @param {function} onClose - Callback function to close the modal.
 * @param {function} onSuccess - Callback function to handle successful selection.
 * @param {string} type - The type of selection (either "group" or "connections").
 * @param {array} shareWithData - Array of data to share with.
 * @param {number} share_type - The type of sharing.
 * @returns The SpecificConnectionorGroup modal component.
 */
import { Button, Modal } from "antd";
import { useState } from "react";
import { SpecificConnectionNugget } from "../../Shared/Context";
import { useDashboard } from "../../Shared/Reduxfetcher";
import { decodeHtml } from "../../Shared/Utility";
import ConnectionsList from "../../Sharedcomponents/Nuggets/ConnectionsList";
import Grouplist from "../../Sharedcomponents/Nuggets/Grouplist";
import classes from "../Modal.module.css";

const SpecificConnectionorGroup = ({
  open,
  onClose,
  onSuccess,
  type,
  shareWithData,
  share_type,
}) => {
  const [ConnectionData, setConnectionData] = useState([]);
  const [FilteredList, setFilteredList] = useState([]);
  const { groupsList, friendsList } = useDashboard();

  const contextvalue = {
    FilteredList,
    ConnectionData,
    setConnectionData,
    setFilteredList,
    type,
    open,
    shareWithData,
    share_type,
  };
  const handleClose = () => {
    if (type === "group") {
      if (shareWithData.length !== 0 && share_type === 3) {
        let findData = groupsList.map((ele) => {
          if (shareWithData.includes(ele.group_id) && ele.my_group === 1) {
            return { ...ele, listname: decodeHtml(ele.group_name) };
          }
        });
        setFilteredList(findData);
        setConnectionData(
          groupsList.filter((ele) => !shareWithData.includes(ele.group_id))
        );
      }
    } else if (type === "connections") {
      if (shareWithData.length !== 0 && share_type === 4) {
        let findData = friendsList.map((ele) => {
          if (shareWithData.includes(ele.user_id)) {
            return { ...ele, listname: decodeHtml(ele.display_name) };
          }
        });
        setFilteredList(findData);
        setConnectionData(
          friendsList.filter((ele) => !shareWithData.includes(ele.user_id))
        );
      } else {
        setConnectionData(friendsList);
        setFilteredList([]);
      }
    }
    onClose();
  };

  return (
    <Modal
      footer={null}
      open={open}
      title={type === "group" ? "Select Group" : "Select Connections"}
      onCancel={() => {
        handleClose();
      }}
    >
      <SpecificConnectionNugget.Provider value={contextvalue}>
        <div className={classes.nuggetModal}>
          {type === "group" && <Grouplist />}
          {type === "connections" && <ConnectionsList />}
        </div>
        <div className={classes.actionBtn}>
          <Button
            type="primary"
            style={{
              marginLeft: "10px",
              opacity: FilteredList.length === 0 ? 0.5 : 1,
              width: "100%",
            }}
            htmlType="Continue"
            size="large"
            className={classes.reportBtn}
            onClickCapture={() => {
              if (FilteredList.length !== 0) {
                onSuccess(FilteredList);
              }
            }}
          >
            Add
          </Button>
        </div>
      </SpecificConnectionNugget.Provider>
    </Modal>
  );
};

export default SpecificConnectionorGroup;
