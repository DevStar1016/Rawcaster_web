import React from "react";
import Event from "../../Sharedcomponents/Events/Event";

const EventsList = () => {
  return (
    <div>
      {[...Array(5)].map((ele) => (
        <Event />
      ))}
    </div>
  );
};

export default EventsList;
