/**
 * A modal component that displays a preview of an image and provides buttons for canceling or adding the image.
 * @param {Object} props - The component props.
 * @param {string} props.url - The URL of the image.
 * @param {function} props.onSuccess - The callback function to be called when the "Add" button is clicked.
 * @param {function} props.onClose - The callback function to be called when the "Cancel" button is clicked.
 * @param {string} props.previewurl - The URL of the preview image.
 * @returns The PreviewModal component.
 */
import { Button } from "antd";
import ImageGrid from "../../UIComponents/Imagegrid/ImageGrid";
import classes from "../Modal.module.css";

const PreviewModal = ({ url, onSuccess, onClose, previewurl }) => {
  /**
   * Retrieves the URL information from the given URL object.
   * @returns An object containing the path, media type, media file type, and media ID.
   */
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
