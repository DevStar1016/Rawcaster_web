/**
 * A React component that renders a modal for starting an event.
 * @param {boolean} [isLoading=false] - Indicates whether the component is in a loading state.
 * @param {boolean} openmodal - Indicates whether the modal is open or closed.
 * @param {function} close - Callback function to close the modal.
 * @param {function} onStart - Callback function to handle the start event.
 * @param {string} [type="Start Hosting"] - The type of event to start.
 * @returns The rendered modal component.
 */
import { Button, Modal } from "antd";
import { handlenuggetVideoPaused } from "../../Store/Redux/Reducer/NuggetsReducer";
import VideoThumb from "../../Assets/Images/Video_preview.jpg";
import { useDispatch } from "react-redux";
import classes from "./Event.module.css";

export default function EventStartModal({
  isLoading = false,
  openmodal,
  close,
  onStart,
  type = "Start Hosting",
}) {
  const dispatch = useDispatch();

  return (
    <Modal
      footer={null}
      centered
      open={openmodal}
      destroyOnClose
      onCancel={close}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{ display: "grid" }}
      >
        <div className={classes.videoHeader}>Rawcaster Event</div>
        <div style={{ display: "grid", padding: "15px 0px" }}>
          <video
            id="dashboard_signup_video"
            className={classes.videoPlayer}
            controls
            disablePictureInPicture
            playsInline
            autoPlay
            controlsList="nodownload"
            poster={VideoThumb}
            onPlayCapture={() => {
              dispatch(handlenuggetVideoPaused(true));
            }}
          >
            <source src="https://rawcaster.s3.us-west-2.amazonaws.com/nuggets/video_47841690153307.mp4" />
          </video>
          {isLoading ? (
            <div style={{ textAlign: "center" }}>
              <img
                src={require("../../Assets/Images/Events/loader.gif")}
                alt=""
                style={{ width: "50%" }}
              />
            </div>
          ) : (
            <Button className={classes.startBtn} onClick={onStart}>
              {type}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
