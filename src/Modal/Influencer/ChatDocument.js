import { useEffect, useRef, useState } from "react";
import ImageGrid from "../../UIComponents/Imagegrid/ImageGrid";
import {
  useAuthData,
  useAuthToken,
  useDashboard,
} from "../../Shared/Reduxfetcher";
import moment from "moment";
import { uploadChatAttachmentService } from "../../Services/ApiService";
import { JSONtoformdata } from "../../Shared/Utility";
import classes from "../Modal.module.css";
import { Progress, Spin } from "antd";
import axios from "axios";
import { toast } from "react-hot-toast";

let isRequestCancel = false;

const ChatDocument = ({
  ele,
  index,
  setNuggetData,
  setNuggetImg,
  onUpload,
}) => {
  const source = useRef(null);
  const token = useAuthToken();
  const userData = useAuthData();
  const { groupsList } = useDashboard();
  const [progress, setProgress] = useState(0);
  const [isuploading, setisuploading] = useState(false);

  /**
   * Retrieves the URL and media information for the given element.
   * @returns {Object} An object containing the path, media type, media file type, and media ID.
   */
  const getURL = () => {
    let type = ele.type.split("/");
    return {
      path: URL.createObjectURL(ele),
      media_type: type[0],
      media_file_type: type[1],
      media_id: ele.lastModified,
    };
  };

  /**
   * Retrieves the group ID of the "My Fans" group from the list of groups.
   * @returns {string} The group ID of the "My Fans" group, or an empty string if the group is not found.
   */
  const getFansGroup = () => {
    let myfansGroup = groupsList.find((ele) => ele.group_name === "My Fans");
    if (myfansGroup) {
      return myfansGroup.group_id;
    } else {
      return "";
    }
  };

  /**
   * Updates the progress value based on the loaded and total values of the progress object.
   * @param {object} progress - The progress object containing the loaded and total values.
   * @returns None
   */
  const handleProgress = (progress) => {
    let val = (progress.loaded / progress.total) * 100;

    setProgress(val);
  };

  /**
   * Handles the upload of an attachment.
   * @param {Object} attachment - The attachment to be uploaded.
   * @returns None
   */
  const handleuploadAttachment = (attachment) => {
    source.current = axios.CancelToken.source();
    setisuploading(true);
    const uniqueId =
      userData.user_id +
      "" +
      getFansGroup() +
      "" +
      moment.utc().format("x") +
      "" +
      Math.floor(Math.random() * 10000 + 1);
    let chatattachmentData = {
      token: token,
      refid: uniqueId,
      chatattachment: attachment,
    };
    uploadChatAttachmentService(
      JSONtoformdata(chatattachmentData),
      handleProgress,
      source.current.token
    )
      .then((res) => {
        if (res.data.status === 1) {
          let finalData = {
            file: ele,
            file_path: res.data.filepath,
          };
          onUpload(finalData);
        } else {
          toast.remove("rawcaster");
          toast.error(res.data.msg, { id: "rawcaster" });
          setNuggetData((pre) => pre.filter((ele, i) => i !== index));
        }
      })
      .catch((err) => {
        setNuggetData((pre) => pre.filter((ele, i) => i !== index));
      })
      .finally(() => {
        setisuploading(false);
      });
  };

  /**
   * Executes a side effect when the component mounts and cleans up the effect when the component unmounts.
   * The effect checks if the 'ele' object exists and does not have a 'file_path' property. If this condition is met,
   * the 'handleuploadAttachment' function is called. Additionally, a cleanup function is returned that cancels any
   * ongoing requests if the 'source' ref is defined and sets the 'isRequestCancel' flag to true.
   * @returns None
   */
  useEffect(() => {
    if (ele && !ele.file_path) {
      handleuploadAttachment(ele);
    }
    return () => {
      if (source.current) {
        isRequestCancel = true;
        source.current.cancel("Request Cancelled");
      }
    };
  }, []);

  return (
    <>
      <div className={classes.cardcontent}>
        <ImageGrid imgArray={[getURL()]} muted={false} isThumb={true} />

        <div
          className={`${classes.progressSec} influencerProgress`}
          style={{ display: isuploading ? "" : "none" }}
        >
          <Spin size="default" spinning={isuploading && progress === 100}>
            <Progress
              type="dashboard"
              percent={progress}
              gapDegree={0}
              size="small"
            />
          </Spin>
        </div>

        <div
          className={classes.overlay}
          style={{ display: isuploading ? "none" : "" }}
          onClick={() => {
            setNuggetData((pre) => pre.filter((ele, i) => i !== index));
          }}
        >
          <span className="material-icons">delete</span>
        </div>
      </div>
      {getURL().media_type.includes("image") && (
        <div
          className={classes.editSec}
          style={{ display: isuploading ? "none" : "" }}
          onClick={() => {
            setNuggetImg({ ele: ele, index: index });
          }}
        >
          <span className="material-symbols-outlined">edit</span>
        </div>
      )}
    </>
  );
};

export default ChatDocument;
