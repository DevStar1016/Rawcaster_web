/**
 * A React component that displays a preview of a file and allows the user to perform actions on it.
 * @returns {JSX.Element} - The rendered component.
 */
import React, { useState } from "react";
import classes from "../ChatBox.module.css";
import { ChatInput } from "../../../Sharedcomponents/Chat/utility";
import { Layout, Tooltip } from "antd";
import { useChatContext } from "../../../Shared/Context";
import ImageEditModal from "../../../Modal/ImageEditModal";
import {
  JSONtoformdata,
  filterValidObject,
  formatBytes,
} from "../../../Shared/Utility";
import { useAuthData, useAuthToken } from "../../../Shared/Reduxfetcher";
import { SendChannelMessageService } from "../../../Services/ApiService";

const PreviewFile = () => {
  const [isEdit, setisEdit] = useState(false);
  const [isFetchingUrl, setisFetchingUrl] = useState(false);
  const userData = useAuthData();
  const token = useAuthToken();
  const {
    GroupDetails,
    PreviewData,
    setPreviewData,
    setMessages,
    convertMessageFormat,
    convertUrlToFile,
  } = useChatContext();
  /**
   * Returns a component based on the type of file in the PreviewData object.
   * @returns A React component that displays the preview of the file.
   */
  const GetComponent = () => {
    const previewFile = PreviewData.File;
    const validcontent = previewFile.type.split("/")[1];

    switch (true) {
      case PreviewData.type.includes("image"):
        return (
          <>
            <div className={classes.actionSec}>
              <Tooltip title="Delete" color={"red"}>
                <div className={classes.deleteIcon}>
                  <span
                    className="material-symbols-rounded"
                    onClick={() => {
                      setPreviewData();
                    }}
                  >
                    delete
                  </span>
                </div>
              </Tooltip>
              {/* <Tooltip title="Edit" color={"orange"}>
                <div>
                  <span
                    className="material-symbols-rounded"
                    onClick={() => {
                      setisEdit(true);
                    }}
                  >
                    tune
                  </span>
                </div>
              </Tooltip> */}
            </div>
            <div className={classes.previewImg}>
              <img src={URL.createObjectURL(previewFile)} />
            </div>
          </>
        );
      case PreviewData.type.includes("video"):
        return (
          <>
            <div className={classes.actionSec}>
              <Tooltip title="Delete" color={"red"}>
                <div className={classes.deleteIcon}>
                  <span
                    className="material-symbols-rounded"
                    onClick={() => {
                      setPreviewData();
                    }}
                  >
                    delete
                  </span>
                </div>
              </Tooltip>
            </div>
            <div className={classes.previewImg}>
              <video controls>
                <source src={URL.createObjectURL(previewFile)} />
              </video>
            </div>
          </>
        );
      case PreviewData.type.includes("doc"):
        return (
          <>
            <div className={classes.actionSec}>
              <Tooltip title="Delete" color={"red"}>
                <div className={classes.deleteIcon}>
                  <span
                    className="material-symbols-rounded"
                    onClick={() => {
                      setPreviewData();
                    }}
                  >
                    delete
                  </span>
                </div>
              </Tooltip>
            </div>
            <div className={classes.previewImg}>
              <div className={classes.fileSec}>
                <i className={classes.file_icon} />

                <h6>{previewFile.name}</h6>
                {validcontent.toUpperCase()}
                <br />
                {formatBytes(previewFile.size)}
              </div>
            </div>
          </>
        );
      default:
        return (
          <>
            <div className={classes.actionSec}>
              <Tooltip title="Delete" color={"red"}>
                <div className={classes.deleteIcon}>
                  <span
                    className="material-symbols-rounded"
                    onClick={() => {
                      setPreviewData();
                    }}
                  >
                    delete
                  </span>
                </div>
              </Tooltip>
            </div>
            <div className={classes.previewImg}>
              <div className={classes.fileSec}>
                <i className={classes.file_icon} />

                <h6>{previewFile.name}</h6>
                {validcontent.toUpperCase()}
                <br />
                {formatBytes(previewFile.size)}
              </div>
            </div>
          </>
        );
    }
  };

  /**
   * Sends a message with the given value and optional parameters.
   * @param {any} val - The value of the message to send.
   * @param {object} [params={}] - Optional parameters for the message.
   * @returns None
   */
  const sendMessage = (val, params = {}) => {
    let send_message_params = {
      ...params,
      token,
      channel_id: GroupDetails?.channel_arn,
      message: val,
    };
    SendChannelMessageService(
      JSONtoformdata(filterValidObject(send_message_params))
    )
      .then((res) => {})
      .catch((err) => {});
  };

  return (
    <Layout.Footer className={classes.footerSec}>
      <div className={classes.previewSec}>
        <GetComponent />
      </div>
      <ChatInput
        isSendOnly
        isSendLoading={isFetchingUrl}
        onSendResponse={(val) => {
          setisFetchingUrl(true);
          convertUrlToFile(PreviewData.File)
            .then((res) => {
              const metaData = {
                meta_data: JSON.stringify({
                  file_path: res.file_path,
                  type: PreviewData.type,
                  file: {
                    name: res.file.name,
                    size: res.file.size,
                    type: res.file.type,
                  },
                }),
              };
              sendMessage(val && val !== "" ? val : " null", metaData);
              setMessages((pre) => [
                {
                  ...convertMessageFormat({
                    file_path: res.file_path,
                    type: PreviewData.type,
                    file: {
                      name: res.file.name,
                      size: res.file.size,
                      type: res.file.type,
                    },
                    message: val,
                    user_name: "me",
                    user: userData?.chime_user_id,
                  }),
                },
                ...pre,
              ]);
            })
            .catch((err) => {})
            .finally(() => {
              setisFetchingUrl(false);
            });
        }}
      />
      {isEdit && (
        <ImageEditModal
          open={isEdit}
          initialFile={PreviewData}
          onSuccess={(url) => {
            var file = new File([url.Blob], "edited_img.jpeg", {
              type: url.Blob.type,
            });
            setisEdit(false);
            setPreviewData({ File: file, type: url.Blob.type });
          }}
          onFailure={() => {
            setisEdit(false);
          }}
        />
      )}
    </Layout.Footer>
  );
};

export default PreviewFile;
