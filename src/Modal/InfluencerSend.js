import { Button, Input, Modal, Tooltip } from "antd";
import React from "react";
import classes from "./Modal.module.css";
import mikeIcon from "../Assets/Images/svg/mikeicon.svg";
import pictureIcon from "../Assets/Images/png/photoIcon.png";
import imageIcon from "../Assets/Images/png/videoAttach.png";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAuthToken } from "../Shared/Reduxfetcher";
import { InfluencerChatService } from "../Services/ApiService";
import { JSONtoformdata } from "../Shared/Utility";
import { toast } from "react-hot-toast";

const validationSchema = yup.object().shape({
  message: yup.string().required(`Please input your Message!`),
});

const InfluencerSend = ({ open, close, user }) => {
  const token = useAuthToken();
  const { values, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      message: "",
    },
    validationSchema,
    onSubmit: (value) => {
      HandleSendMessage(value);
    },
  });

  const HandleSendMessage = (value) => {
    let finalObj = {
      ...value,
      token,
      user_id: user.user_id,
    };
    InfluencerChatService(JSONtoformdata(finalObj))
      .then((res) => {
        if (res.data.status === 1) {
          Modal.success({
            content: res.data.msg,
          });
        } else if (res.data.status === 0) {
          Modal.error({
            title: "error",
            content: res.data.msg,
          });
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        close();
      });
  };

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={() => {
        close();
      }}
    >
      <div className={classes.influencerModal}>
        <h2>Send message to {user?.first_name}</h2>

        <div className={classes.topProsec}>
          <div className={classes.leftec}>
            <div className={classes.postTextcontent}>
              <Input.TextArea
                id="post_nugget_textarea"
                className={classes.postTextarea}
                placeholder={`What’s on your mind for ${user?.first_name} !`}
                value={values.message}
                onChange={handleChange("message")}
              />
              {touched.message && <p className="ErrTxt">{errors?.message}</p>}
            </div>
          </div>
          <div className={classes.rightSec}>
            <Tooltip title="Record Audio">
              <img src={mikeIcon} />
            </Tooltip>

            <Tooltip title="Upload Image">
              <img src={pictureIcon} />
            </Tooltip>

            <Tooltip title="Upload Video">
              <img src={imageIcon} />
            </Tooltip>
          </div>
        </div>

        <>
          <Button
            className={classes.btnstyle}
            onClickCapture={() => {
              console.log("test");
              handleSubmit();
            }}
          >
            Send
          </Button>
        </>
      </div>
    </Modal>
  );
};

export default InfluencerSend;
