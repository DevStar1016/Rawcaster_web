import { Modal } from "antd";
import React from "react";
import { handleProfileNavigate } from "../../Shared/Utility";
import classes from "./Connection.module.css";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useNuggets } from "../../Shared/Reduxfetcher";

const ConnectionModal = ({
  type,
  open,
  onSuccess,
  onClose,
  value,
  setisInfluencerChatModalOpen,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { nuggetFormData } = useNuggets();

  return (
    <Modal
      open={open}
      width={800}
      footer={[null]}
      onOk={() => {
        onSuccess();
      }}
      onCancel={() => {
        onClose();
      }}
    >
      <div className={classes.modalContainer}>
        <h2>
          {type} - {value?.allconnectionscount}
        </h2>

        <div className={classes.listSec}>
          {value.allconnections.map((ele) => {
            return (
              <>
                <div className={classes.list}>
                  <div className={classes.iconSec}>
                    <i
                      className={classes.messageIcon}
                      onClick={() => {
                        setisInfluencerChatModalOpen({
                          user: ele,
                          show: true,
                        });
                      }}
                    />
                  </div>
                  <img
                    src={ele.profile_img}
                    onClick={() => {
                      onClose();
                      let finalData = {
                        dispatch,
                        navigate,
                        nuggetFormData,
                        user_id: ele.user_id,
                      };
                      handleProfileNavigate(finalData);
                    }}
                  />
                  <p
                    onClick={() => {
                      onClose();
                      let finalData = {
                        dispatch,
                        navigate,
                        nuggetFormData,
                        user_id: ele.user_id,
                      };
                      handleProfileNavigate(finalData);
                    }}
                  >
                    {ele?.display_name}
                  </p>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default ConnectionModal;
