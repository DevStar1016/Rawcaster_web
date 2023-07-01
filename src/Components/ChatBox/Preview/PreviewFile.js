import React, { useState } from "react";
import classes from "../ChatBox.module.css";
import { ChatInput } from "../../../Sharedcomponents/Chat/utility";
import { Layout, Tooltip } from "antd";
import { useChatContext } from "../../../Shared/Context";
import ImageEditModal from "../../../Modal/ImageEditModal";
import { formatBytes } from "../../../Shared/Utility";
import { useAuthData } from "../../../Shared/Reduxfetcher";

const PreviewFile = () => {
  const [isEdit, setisEdit] = useState(false);
  const userData = useAuthData();
  const {
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
      case PreviewData.display_type.includes("doc"):
        return (
          <>
            <div className={classes.actionSec}>
              <Tooltip title="Delete" color={"red"}>
                <div className={classes.deleteIcon}>
                  <span
                    class="material-symbols-rounded"
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
      case previewFile.type.includes("image"):
        return (
          <>
            <div className={classes.actionSec}>
              <Tooltip title="Delete" color={"red"}>
                <div className={classes.deleteIcon}>
                  <span
                    class="material-symbols-rounded"
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
                    class="material-symbols-rounded"
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
      case previewFile.type.includes("video"):
        return (
          <>
            <div className={classes.actionSec}>
              <Tooltip title="Delete" color={"red"}>
                <div className={classes.deleteIcon}>
                  <span
                    class="material-symbols-rounded"
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
      default:
        return (
          <>
            <div className={classes.actionSec}>
              <Tooltip title="Delete" color={"red"}>
                <div className={classes.deleteIcon}>
                  <span
                    class="material-symbols-rounded"
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
  return (
    <Layout.Footer className={classes.footerSec}>
      <div className={classes.previewSec}>
        <GetComponent />
      </div>
      <ChatInput
        isSendOnly
        onSendResponse={(val) => {
          convertUrlToFile(PreviewData.File)
            .then((res) => {
              const validType = res.file.type.split("/")[0];
              setMessages((pre) => [
                ...pre,
                {
                  ...convertMessageFormat({
                    type: validType,
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
