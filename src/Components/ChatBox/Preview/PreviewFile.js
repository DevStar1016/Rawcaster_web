import React, { useState } from "react";
import classes from "../ChatBox.module.css";
import { ChatInput } from "../../../Sharedcomponents/Chat/utility";
import { Layout, Tooltip } from "antd";
import { useChatContext } from "../../../Shared/Context";
import ImageEditModal from "../../../Modal/ImageEditModal";
import { filterValidObject, formatBytes } from "../../../Shared/Utility";
import { useAuthData } from "../../../Shared/Reduxfetcher";
import { sendChannelMessage } from "../../../Services/Messaging/MessageAPIList";

const PreviewFile = () => {
  const [isEdit, setisEdit] = useState(false);
  const [isFetchingUrl, setisFetchingUrl] = useState(false);
  const userData = useAuthData();
  const {
    GroupDetails,
    PreviewData,
    setPreviewData,
    setMessages,
    convertMessageFormat,
    convertUrlToFile,
  } = useChatContext();
  const GetComponent = () => {
    const previewFile = PreviewData.File;
    const validcontent = previewFile.type.split("/")[1];

    switch (true) {
      case PreviewData.display_type.includes("image"):
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
              <Tooltip title="Edit" color={"orange"}>
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
              </Tooltip>
            </div>
            <div className={classes.previewImg}>
              <img src={URL.createObjectURL(previewFile)} />
            </div>
          </>
        );
      case PreviewData.display_type.includes("video"):
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
      case PreviewData.display_type.includes("doc"):
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

  const sendMessage = (val, params = {}) => {
    let data = {
      ...params,
      Type: "STANDARD",
      Persistence: "PERSISTENT",
      ChannelArn: GroupDetails?.channel_arn,
      ChimeBearer: userData.chime_user_id,
      Content: val,
    };
    sendChannelMessage(filterValidObject(data))
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
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
                Metadata: JSON.stringify({
                  file: res.file_path,
                  type: PreviewData.display_type,
                  web_file: {
                    name: res.file.name,
                    size: res.file.size,
                    type: res.file.type,
                  },
                }),
              };
              sendMessage(val && val !== "" ? val : " null", metaData);

              setMessages((pre) => [
                ...pre,
                {
                  ...convertMessageFormat({
                    type: PreviewData.display_type,
                    message: val,
                    file: res.file,
                    file_path: res.file_path,
                    user_name: "me",
                    user: userData?.chime_user_id,
                  }),
                },
              ]);
            })
            .catch((err) => {
              console.log(err);
            })
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
            setPreviewData({ File: file, display_type: url.Blob.type });
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
