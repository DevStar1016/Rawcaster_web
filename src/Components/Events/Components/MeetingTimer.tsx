import { useEffect, useState } from "react";
import { useEventRoomContext } from "../../../Shared/Context";
import { EventContextProp } from "./types";

const MeetingTimer = () => {
  const [timer, setTimer] = useState("");
  const { meetingTimer }: EventContextProp = useEventRoomContext();

  useEffect(() => {
    const date = new Date(meetingTimer || 0);
    let minutes = date.getMinutes();
    let seconds = minutes * 60 + date.getSeconds();

    const countdownInterval = setInterval(() => {
      seconds--;

      const remainingMinutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;

      const updatedMinutes =
        remainingMinutes.toString().length !== 1
          ? remainingMinutes
          : "0" + remainingMinutes;
      const updatedSeconds =
        remainingSeconds.toString().length !== 1
          ? remainingSeconds
          : "0" + remainingSeconds;

      setTimer(`${updatedMinutes}:${updatedSeconds}`);

      if (remainingMinutes == 0 && remainingSeconds == 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, []);

  return (
    <div style={{ color: "white", fontSize: "22px" }}>
      Meeting ends in :{" "}
      <span style={{ color: "red", marginRight: 20 }}>{timer}</span>
    </div>
  );
};

export default MeetingTimer;
