import { Button } from "antd";
import React from "react";
import ImageGrid from "../../UIComponents/Imagegrid/ImageGrid";
import classes from "../Modal.module.css";

const PreviewModal = ({ url, onSuccess, onClose, previewurl }) => {
  const getURL = () => {
    let type = url.type.split("/");
    return {
      path: previewurl,
      media_type: type[0],
      media_file_type: type[1],
      media_id: url.lastModified,
    };
  };

  return (
    <div style={{ width: "100%" }}>
      <div className={classes.imageGridContainer}>
        <ImageGrid imgArray={[getURL()]} isPreview={true} />
      </div>
      <div className={classes.actionBtn}>
        <Button
          ghost
          type="primary"
          htmlType="button"
          size="large"
          className={classes.cancelBtn}
          onClickCapture={() => {
            onClose();
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
          onClickCapture={() => {
            onSuccess(url);
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default PreviewModal;
