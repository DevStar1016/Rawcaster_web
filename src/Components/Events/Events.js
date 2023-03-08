import React from "react";
import { useAuthData } from "../../Shared/Reduxfetcher";
import BeforeAuthEvents from "./BeforeAuthEvents";
import CreateEvent from "./CreateEvent";
import classes from "./Events.module.css";

const Events = () => {
  const loginUserData = useAuthData();
  return (
    <div className={classes.eventSec}>
      {/* BEFORE LOGIN START */}
      {loginUserData === null ? (
        <BeforeAuthEvents />
      ) : (
        <>
          <CreateEvent />
        </>
      )}
      {/* END */}
    </div>
  );
};

export default Events;
