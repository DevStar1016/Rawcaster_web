import { Button, Modal } from "antd";
import React, { useState } from "react";
import {
  SpecificConnectionNugget,
  usePostNuggetContext,
  useSingleNuggetContext,
} from "../../Shared/Context";
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
          if (shareWithData.includes(ele.group_id)) {
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
            ghost
            type="primary"
            htmlType="button"
            size="large"
            className={classes.cancelBtn}
            onClickCapture={() => {
              handleClose();
            }}
          >
            Cancel
          </Button>

          <Button
            type="primary"
            style={{ marginLeft: "10px" }}
            htmlType="Continue"
            size="large"
            className={classes.reportBtn}
            disabled={FilteredList.length === 0}
            onClickCapture={() => {
              onSuccess(FilteredList);
            }}
          >
            Add
          </Button>
          {/* )} */}
        </div>
      </SpecificConnectionNugget.Provider>
    </Modal>
  );
};

export default SpecificConnectionorGroup;
