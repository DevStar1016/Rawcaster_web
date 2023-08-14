import React from "react";
import EventBox from "./EventBox";
import Reactions from "../Components/Reactions";

const EventRoom = () => {
  return (
    <div>
      {/* <div
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
        }}
      >
        <Reactions />
      </div> */}
      <EventBox />
    </div>
  );
};

export default EventRoom;
